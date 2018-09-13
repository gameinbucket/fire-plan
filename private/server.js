const http = require('http')
const fs = require('fs')
const path = require('path')

const port = 3000
const public = '../public'
const home = 'app.html'
const content_header = 'Content-type'
const error_message = 'internal server error'
const plain_text = 'text/plain'

const extension_map = {
    '.ico': 'image/x-icon',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
}

const file_cache = {}

function serve(req, res) {

    if (req.url.startsWith('/api/')) {
        res.setHeader(content_header, plain_text)
        res.end('this is an rest api call')
        return
    }

    let url = public + req.url
    if (req.url === '/') {
        url += home
    }

    let extension = path.parse(url).ext

    if (file_cache[req.url]) {
        res.setHeader(content_header, extension_map[extension] || plain_text)
        res.end(file_cache[req.url])
        return
    }

    console.log(url)
    
    fs.exists(url, function(exist) {
        if (!exist) {
            res.statusCode = 404
            res.end(`${req.url} not found!`)
            return
        }
        fs.readFile(url, function(err, data) {
            if (err) {
                res.statusCode = 500
                res.end(error_message)
                console.log(err)
                return
            }
            file_cache[req.url] = data
            res.setHeader(content_header, extension_map[extension] || plain_text)
            res.end(data)
        })
    })
}

http.createServer(serve).listen(port)
console.log(`listening on port ${port}`)