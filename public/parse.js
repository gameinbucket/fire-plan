class Parse {
    static Message(message) {
        let size = message.length
        let store = []
        let middle = 0
        let start = 0
        for (let end = 0; end < size; end++) {
            let current = message[end]
            if (current === ':') {
                middle = end
            } else if (current === ' ') {
                let key = message.substring(start, middle)
                let value = message.substring(middle + 1, end)
                store[key] = value
                start = end + 1
            }
        }
        return store
    }
    static Print(store) {
        Object.keys(store).forEach(function(key) {
            console.log(key + ":" + store[key]);
        });
    }
}