
function process(req, res) {
    if (req.method === 'POST') {
        let body = []
        req.on('data', (chunk) => {
            body.push(chunk)
        }).on('end', () => {
            body = Buffer.concat(body).toString()
            res.end(body)
        })
        res.setHeader('Content-type', 'text/plain')
        res.end('this is a POST api call')
    } else {
        res.setHeader('Content-type', 'text/plain')
        res.end('this is a GET api call')
    }
}

module.exports.process = process