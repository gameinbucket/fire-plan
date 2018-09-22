class Network {
    static Request(data, callback) {
        const content_header = 'Content-Type'
        const type_text = 'text/plain'

        const xhr = new XMLHttpRequest()
        xhr.open('POST', 'api')
        xhr.setRequestHeader(content_header, type_text)
        xhr.responseType = type_text
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                callback(xhr.responseText)
            }
        }
        xhr.send(data)
    }
}