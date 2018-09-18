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

var retireFields = [...]string{
	"inflation",
	"stock.return",
	"bond.return",
	"cash.return",
	"current.cash",
	"current.stocks",
	"current.bonds",
	"annual.cash",
	"annual.stocks",
	"annual.bonds",
	"expenses",
	"age",
	"withdraw",
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
	return store
}

func handleSaveRetire(store map[string]string, w http.ResponseWriter) {
	user := store["user"]
	err := db.Update(func(t *bolt.Tx) error {
		var err error
		userBucket, err := t.CreateBucketIfNotExists([]byte(user))
		if err != nil {
			return fmt.Errorf("failed create bucket: %s", err)
		}
		retireBucket, err := userBucket.CreateBucketIfNotExists([]byte("retire"))
		if err != nil {
			return fmt.Errorf("failed create bucket: %s", err)
		}
		for _, field := range retireFields {
			val, ok := store[field]
			if ok {
				putBucket(retireBucket, field, val)
			}
		}
		return nil
	})
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Println(err)
	}
}

func handleGetRetire(store map[string]string, w http.ResponseWriter) {
	user := store["user"]
	message := strings.Builder{}

	err := db.View(func(t *bolt.Tx) error {
		userBucket := t.Bucket([]byte(user))
		if userBucket == nil {
			return nil
		}
		retireBucket := userBucket.Bucket([]byte("retire"))
		if retireBucket == nil {
			return nil
		}
		cursor := retireBucket.Cursor()
		for key, value := cursor.First(); key != nil; key, value = cursor.Next() {
			message.Write(key)
			message.WriteString(":")
			message.Write(value)
			message.WriteString(" ")
		}
		return nil
	})

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Println(err)
	} else {
		w.Write([]byte(message.String()))
	}
}

func handleAPI(store map[string]string, w http.ResponseWriter) {
	switch store["req"] {
	case "save-retire":
		handleSaveRetire(store, w)
	case "get-retire":
		handleGetRetire(store, w)
	}
}

func putBucket(b *bolt.Bucket, k, v string) {
	err := b.Put([]byte(k), []byte(v))
	if err != nil {
		fmt.Println(err)
	}
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
			store := parse(body)
			handleAPI(store, w)

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

	typ, ok := extensions[filepath.Ext(path)]
	if !ok {
		return
	}

	contents, ok := fileCache[path]
	ok = false
	if !ok {
		file, err := os.Open(path)
		if err != nil {
			return
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
