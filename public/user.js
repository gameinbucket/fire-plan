class User {
    constructor(name, ticket) {
        this.name = localStorage.getItem(name)
        this.ticket = localStorage.getItem(ticket)
        this.password = null
        this.validate_ticket()
    }
    not_in() {
        console.log(this.name, ',', this.ticket, ',', this.password)
        return this.name === null || (this.ticket === null && this.password === null)
    }
    validate_ticket() {
        if (this.not_in())
            return
        let self = this
        let call = function (data) {
            if (data !== '') {
                self.name = null
                self.ticket = null
            }
        }
        let data = `user:${this.name}|ticket:${this.ticket}|`
        Network.Request(data, call)
    }
    request_sign_in(call) {
        if (this.name === null || this.password === null) {
            console.log('username and password required')
            return
        }
        let self = this
        let data = `req:sign-in|user:${this.name}|password:${this.password}|`
        Network.Request(data, (data) => {
            let store = Pack.Parse(data)
            if (store['error']) {
                console.log('error ' + store['error'])
                return
            }
            if (store['ticket']) {
                self.ticket = store['ticket']
                localStorage.setItem('user', self.name)
                localStorage.setItem('ticket', self.ticket)
                call()
            }
        })
        this.password = null
    }
    request_sign_up(call) {
        let self = this
        let data = `req:sign-up|user:${this.name}|password:${this.password}|`
        Network.Request(data, (data) => {
            let store = Pack.Parse(data)
            if (store['error']) {
                console.log('error ' + store['error'])
                return
            }
            if (store['ticket']) {
                self.ticket = store['ticket']
                localStorage.setItem('user', self.name)
                localStorage.setItem('ticket', self.ticket)
                call()
            }
        })
        this.password = null
    }
    request_sign_out() {
        let data = `req:sign-out|user:${this.name}|ticket:${this.ticket}|`
        Network.Request(data, () => {})
        this.name = null
        this.ticket = null
        localStorage.removeItem('user')
        localStorage.removeItem('ticket')
    }
}