package main

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/boltdb/bolt"
)

var retireBucket = []byte("retire")
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
	"death",
}

func saveRetire(store map[string]string, w http.ResponseWriter) {
	user := store["user"]
	err := db.Update(func(t *bolt.Tx) error {
		var err error
		userBucket, err := t.CreateBucketIfNotExists([]byte(user))
		if err != nil {
			return fmt.Errorf("failed create bucket: %s", err)
		}
		retireBucket, err := userBucket.CreateBucketIfNotExists(retireBucket)
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
		fmt.Println(err)
	}
}

func getRetire(store map[string]string, w http.ResponseWriter) {
	user := store["user"]
	message := strings.Builder{}
	err := db.View(func(t *bolt.Tx) error {
		userBucket := t.Bucket([]byte(user))
		if userBucket == nil {
			return nil
		}
		retireBucket := userBucket.Bucket(retireBucket)
		if retireBucket == nil {
			return nil
		}
		cursor := retireBucket.Cursor()
		for key, value := cursor.First(); key != nil; key, value = cursor.Next() {
			message.Write(key)
			message.WriteString(":")
			message.Write(value)
			message.WriteString("|")
		}
		return nil
	})
	if err != nil {
		fmt.Println(err)
	} else {
		w.Write([]byte(message.String()))
	}
}
