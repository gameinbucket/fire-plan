package main

import (
	"encoding/binary"
	"fmt"
	"net/http"
	"strings"

	"github.com/boltdb/bolt"
)

var budgetBucket = []byte("budget")
var budgetFields = [...]string{
	"name",
	"cost",
	"category",
	"note",
}

func saveBudget(store map[string]string, w http.ResponseWriter) {
	user := store["user"]
	err := db.Update(func(t *bolt.Tx) error {
		var err error
		userBucket, err := t.CreateBucketIfNotExists([]byte(user))
		if err != nil {
			return fmt.Errorf("failed create bucket: %s", err)
		}
		budgetBucket, err := userBucket.CreateBucketIfNotExists(budgetBucket)
		if err != nil {
			return fmt.Errorf("failed create bucket: %s", err)
		}

		nextSeq, _ := budgetBucket.NextSequence()
		seqID := make([]byte, 8)
		binary.BigEndian.PutUint64(seqID, uint64(nextSeq))
		budgetBucket.Put(seqID, []byte("something"))

		for _, field := range retireFields {
			val, ok := store[field]
			if ok {
				putBucket(budgetBucket, field, val)
			}
		}
		return nil
	})
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Println(err)
	}
}

func getBudget(store map[string]string, w http.ResponseWriter) {
	user := store["user"]
	message := strings.Builder{}

	err := db.View(func(t *bolt.Tx) error {
		userBucket := t.Bucket([]byte(user))
		if userBucket == nil {
			return nil
		}
		budgetBucket := userBucket.Bucket(budgetBucket)
		if budgetBucket == nil {
			return nil
		}
		cursor := budgetBucket.Cursor()
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
