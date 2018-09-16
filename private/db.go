package main

import (
	"fmt"
	"log"

	"github.com/boltdb/bolt"
)

func testDb() {
	db, err := bolt.Open("database.db", 0600, nil)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	err = db.Update(func(tx *bolt.Tx) error {
		var err error
		b := tx.Bucket([]byte("users"))
		if b == nil {
			b, err = tx.CreateBucket([]byte("users"))
		}
		if err != nil {
			return fmt.Errorf("create bucket: %s", err)
		}
		err = b.Put([]byte("answer"), []byte("42"))
		return err
	})
	if err != nil {
		log.Fatal(err)
	}
	db.View(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte("users"))
		c := b.Cursor()
		for k, v := c.First(); k != nil; k, v = c.Next() {
			fmt.Printf("key=%s, value=%s\n", k, v)
		}
		return nil
	})
}
