package main

import (
	"unicode"
)

var special = map[rune]bool{
	'~': true,
	'!': true,
	'@': true,
	'#': true,
	'$': true,
	'%': true,
	'^': true,
	'&': true,
	'*': true,
	'(': true,
	')': true,
	'-': true,
	'_': true,
	'=': true,
	'+': true,
	'<': true,
	',': true,
	'>': true,
	'.': true,
	'?': true,
	'/': true,
	':': true,
	';': true,
	'{': true,
	'[': true,
	']': true,
	'}': true,
	'|': true,
	' ': true,
}

func parsePack(message []rune) map[string]string {
	size := len(message)
	store := make(map[string]string)
	middle := 0
	start := 0
	for end := 0; end < size; end++ {
		current := message[end]
		if unicode.IsLetter(current) || unicode.IsNumber(current) || isSpecial(current) {
			if current == ':' {
				middle = end
			} else if current == '|' {
				if start < middle && middle < end && end <= size {
					key := string(message[start:middle])
					value := string(message[middle+1 : end])
					if clean(key) && clean(value) {
						store[key] = value
						start = end + 1
					} else {
						return nil
					}
				} else {
					return nil
				}
			}
		} else {
			return nil
		}
	}
	return store
}

func isSpecial(c rune) bool {
	_, exist := special[c]
	return exist
}

func clean(word string) bool {
	if word == "" {
		return false
	}
	return true
}
