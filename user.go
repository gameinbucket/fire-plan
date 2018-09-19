package main

import (
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
	user := []byte(store["user"])
	password := store["password"]
	err := db.Update(func(t *bolt.Tx) error {
		var err error
		userBucket := t.Bucket(user)
		if userBucket != nil {
			w.WriteHeader(http.StatusUnauthorized)
			return nil
		}
		userBucket, err = t.CreateBucket(user)
		if err != nil {
			return fmt.Errorf("failed create bucket: %s", err)
		}
		passwordHash, _ := hashPassword(password)
		userBucket.Put(passwordKey, passwordHash)
		return nil
	})
	if err != nil {
		fmt.Println(err)
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
			ticket := []byte("blah")
			w.Write(ticket)
		} else {
			w.WriteHeader(http.StatusUnauthorized)
		}
		return
	}
	w.WriteHeader(http.StatusInternalServerError)
	fmt.Println(err)
}
