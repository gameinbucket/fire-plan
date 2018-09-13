const http = require('http')
const port = 3030

function serve(req, res) {
    if (req.method === 'POST') {
        let body = []
        req.on('data', (chunk) => {
            body.push(chunk)
        }).on('end', () => {
            body = Buffer.concat(body).toString()
            res.end(body)
        })
        return
    }
}

http.createServer(serve).listen(port)
console.log(`listening on port ${port}`)