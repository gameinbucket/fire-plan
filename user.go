package main

import (
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"net/http"

	"github.com/boltdb/bolt"
	"golang.org/x/crypto/bcrypt"
)

var passwordKey = []byte("password")

func hashPassword(password string) ([]byte, error) {
	return bcrypt.GenerateFromPassword([]byte(password), 14)
}

func checkPassword(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func signUp(store map[string]string, w http.ResponseWriter) {
	user := store["user"]
	password := store["password"]
	err := db.Update(func(t *bolt.Tx) error {
		var err error
		userBucket := t.Bucket([]byte(user))
		if userBucket != nil {
			w.WriteHeader(http.StatusUnauthorized)
			w.Write([]byte("error:user already exists|"))
			return nil
		}
		userBucket, err = t.CreateBucket([]byte(user))
		if err != nil {
			return fmt.Errorf("failed create bucket: %s", err)
		}
		passwordHash, _ := hashPassword(password)
		userBucket.Put(passwordKey, passwordHash)
		ticket := handleTicket(user)
		w.Write([]byte("ticket:"))
		w.Write([]byte(ticket))
		w.Write([]byte("|"))
		return nil
	})
	if err != nil {
		fmt.Println(err)
		w.Write([]byte("error:something went wrong|"))
	}
}

func signIn(store map[string]string, w http.ResponseWriter) {
	user := store["user"]
	password := store["password"]
	var passwordHash string
	err := db.View(func(t *bolt.Tx) error {
		userBucket := t.Bucket([]byte(user))
		if userBucket == nil {
			return nil
		}
		passwordHash = string(userBucket.Get(passwordKey))
		return nil
	})
	if err == nil {
		if checkPassword(password, passwordHash) {
			ticket := handleTicket(user)
			w.Write([]byte("ticket:"))
			w.Write([]byte(ticket))
			w.Write([]byte("|"))
		} else {
			w.WriteHeader(http.StatusUnauthorized)
			w.Write([]byte("error:username or password incorrect|"))
		}
		return
	}
	fmt.Println(err)
	w.WriteHeader(http.StatusInternalServerError)
	w.Write([]byte("error:something went wrong|"))
}

func handleTicket(user string) string {
	const len = 32
	bytes := make([]byte, len)
	_, err := rand.Read(bytes)
	if err != nil {
		panic(err)
	}
	ticket := base64.URLEncoding.EncodeToString(bytes)
	tickets[user] = ticket
	return ticket
}

func signOut(store map[string]string, w http.ResponseWriter) {
	delete(tickets, store["user"])
	w.Write([]byte("message:success|"))
}
