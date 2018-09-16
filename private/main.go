package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"path/filepath"

	"github.com/boltdb/bolt"
)

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

var db *DB

func serve(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		w.Header().Set("Content-type", "text/plain")
		w.Write([]byte("look what we got"))
		return
	}

	fmt.Println("request", r.URL.Path)
	var path string
	if r.URL.Path == "/" {
		path = "../public/app.html"
	} else {
		path = "../public" + r.URL.Path
	}
	file, err := os.Open(path)
	if err != nil {
		panic(err)
	}
	typ := extensions[filepath.Ext(path)]
	w.Header().Set("Content-type", typ)
	contents, err := ioutil.ReadAll(file)
	if err != nil {
		panic(err)
	}
	w.Write(contents)
}

func main() {
	db, err := bolt.Open("database.db", 0600, nil)
	if err != nil {
		log.Fatal(err)
	}

	http.ListenAndServe(":3000", http.HandlerFunc(serve))
	defer db.Close()
}
