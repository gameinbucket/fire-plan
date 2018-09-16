package main

import (
	"context"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"os/signal"
	"path/filepath"
	"strings"
	"syscall"

	"github.com/boltdb/bolt"
)

const contentType = "Content-type"
const textPlain = "text/plain"
const dir = "./public"
const home = dir + "/app.html"
const api = "/api"

var extensions = map[string]string{
	".html": "text/html",
	".js":   "text/javascript",
	".json": "application/json",
	".css":  "text/css",
	".png":  "image/png",
	".jpg":  "image/jpeg",
	".wav":  "audio/wav",
	".mp3":  "audio/mpeg",
}

var fileCache = map[string][]byte{}
var server *http.Server
var db *bolt.DB

func parse(message []byte) map[string]string {
	size := len(message)
	store := make(map[string]string)
	middle := 0
	start := 0
	for end := 0; end < size; end++ {
		current := message[end]
		if current == ':' {
			middle = end
		} else if current == ' ' {
			key := string(message[start:middle])
			value := string(message[middle+1 : end])
			store[key] = value
			start = end + 1
		}
	}

	for key, value := range store {
		fmt.Println("k=", key, "v=", value)
	}

	return store
}

func serve(w http.ResponseWriter, r *http.Request) {
	fmt.Println(r.Method, r.URL.Path)

	if strings.HasPrefix(r.URL.Path, api) {
		if r.Method == "POST" {
			w.Header().Set(contentType, textPlain)
			body, err := ioutil.ReadAll(r.Body)
			if err != nil {
				panic(err)
			}
			w.Write(body)

			store := parse(body)
			if store["req"] == "save-retire" {
				user := store["user"]
				inflation := store["inflation"]

				err = db.Update(func(tx *bolt.Tx) error {
					var err error
					bucket := tx.Bucket([]byte(user))
					if bucket == nil {
						bucket, err = tx.CreateBucket([]byte(user))
					}
					if err != nil {
						return fmt.Errorf("failed create bucket: %s", err)
					}
					err = bucket.Put([]byte("inflation"), []byte(inflation))
					return err
				})
				if err != nil {
					panic(err)
				}
				w.Write([]byte("saved data!"))

			} else if store["req"] == "get-retire" {
				user := store["user"]
				var inflation []byte

				err := db.View(func(tx *bolt.Tx) error {
					bucket := tx.Bucket([]byte(user))
					if bucket == nil {
						return nil
					}
					cursor := bucket.Cursor()
					for key, value := cursor.First(); key != nil; key, value = cursor.Next() {
						if string(key) == "inflation" {
							inflation = value
						}
					}
					return nil
				})

				if err != nil {
					fmt.Println(err)
				} else {
					w.Write([]byte("retrieved data = "))
					w.Write(inflation)
				}
			}
		} else {
			w.Header().Set(contentType, textPlain)
			w.Write([]byte("GET " + r.URL.Path))
		}
		return
	}

	var path string
	if r.URL.Path == "/" {
		path = home
	} else {
		path = dir + r.URL.Path
	}

	contents, ok := fileCache[path]
	typ := extensions[filepath.Ext(path)]

	if !ok {
		file, err := os.Open(path)
		if err != nil {
			panic(err)
		}
		contents, err = ioutil.ReadAll(file)
		if err != nil {
			panic(err)
		}
		fileCache[path] = contents
	}

	w.Header().Set(contentType, typ)
	w.Write(contents)
}

func main() {

	stop := make(chan os.Signal)
	signal.Notify(stop, syscall.SIGINT, syscall.SIGTERM)

	var err error

	db, err = bolt.Open("fire.db", 0600, nil)
	if err != nil {
		panic(err)
	}

	const port = "3000"
	server = &http.Server{Addr: ":" + port, Handler: http.HandlerFunc(serve)}

	fmt.Println("listening on port " + port)
	go func() {
		err := server.ListenAndServe()
		if err != nil {
			fmt.Println(err)
		}
	}()

	<-stop
	fmt.Println("signal interrupt")
	server.Shutdown(context.Background())
	db.Close()
	fmt.Println()
}
