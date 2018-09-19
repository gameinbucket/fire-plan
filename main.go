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
var tickets = map[string]string{}
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

func handleAPI(store map[string]string, w http.ResponseWriter) {
	user := store["user"]
	ticket := store["ticket"]
	trueTicket, ok := tickets[user]
	if !ok || ticket != trueTicket {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}
	switch store["req"] {
	case "signup":
		signUp(store, w)
	case "signin":
		signIn(store, w)
	case "save-retire":
		saveRetire(store, w)
	case "get-retire":
		getRetire(store, w)
	case "save-budget":
		saveBudget(store, w)
	case "get-budget":
		getBudget(store, w)
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
