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
	"time"

	"github.com/boltdb/bolt"
)

const contentType = "Content-type"
const textPlain = "text/plain"
const dir = "./public"
const home = dir + "/app.html"
const api = "/api"
const caching = false
const sessionTime = 60 * 30

var extensions = map[string]string{
	".html": "text/html",
	".js":   "text/javascript",
	".css":  "text/css",
	".png":  "image/png",
	".jpg":  "image/jpeg",
	".svg":  "image/svg+xml",
	".ico":  "image/x-icon",
	".wav":  "audio/wav",
	".mp3":  "audio/mpeg",
	".json": "application/json",
	".ttf":  "application/font-ttf",
}

var server *http.Server
var db *bolt.DB
var files = map[string][]byte{}

var users = map[string]*User{}
var rate = map[string]int{}

func handleAPI(store map[string]string, w http.ResponseWriter) {
	if store == nil {
		w.Write([]byte("error:bad request|"))
		return
	}
	userName, ok := store["user"]
	if !ok || len(userName) < 3 {
		w.Write([]byte("error:bad request|"))
		return
	}
	userTicket, ok := store["ticket"]
	if !ok {
		if store["req"] == "sign-in" {
			signIn(store, w)
		} else if store["req"] == "sign-up" {
			signUp(store, w)
		} else {
			w.Write([]byte("error:bad request|"))
		}
		return
	}
	user, ok := users[userName]
	if !ok || userTicket != user.Ticket {
		w.Write([]byte("error:bad ticket|"))
		return
	}
	currentTime := time.Now().Unix()
	if currentTime > user.TicketEnd {
		w.Write([]byte("error:session expired|"))
		return
	}
	user.TicketEnd = currentTime + sessionTime
	ticket := refreshTicket(user)
	w.Write([]byte("ticket:"))
	w.Write([]byte(ticket))
	w.Write([]byte("|"))

	switch store["req"] {
	case "sign-out":
		signOut(store, w)
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
	fmt.Println(r.RemoteAddr, r.Method, r.URL.Path)

	if strings.HasPrefix(r.URL.Path, api) {
		if r.Method == "POST" {
			w.Header().Set(contentType, textPlain)
			body, err := ioutil.ReadAll(r.Body)
			if err != nil {
				panic(err)
			}
			store := parsePack([]rune(string(body)))
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

	var contents []byte
	if caching {
		contents, ok := files[path]
		if !ok {
			file, err := os.Open(path)
			if err != nil {
				path = home
				file, err = os.Open(path)
				if err != nil {
					return
				}
			}
			contents, err = ioutil.ReadAll(file)
			if err != nil {
				panic(err)
			}
			files[path] = contents
		}
	} else {
		file, err := os.Open(path)
		if err != nil {
			path = home
			file, err = os.Open(path)
			if err != nil {
				return
			}
		}
		contents, err = ioutil.ReadAll(file)
		if err != nil {
			panic(err)
		}
	}

	typ, ok := extensions[filepath.Ext(path)]
	if !ok {
		return
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
