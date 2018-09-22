class User {
    constructor(name, ticket) {
        this.name = localStorage.getItem(name)
        this.ticket = localStorage.getItem(ticket)
        this.password = null
        this.validate_ticket()
    }
    validate_ticket() {
        if (this.name === null || this.ticket === null) {
            return
        }
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
    request_sign_in() {
        let self = this
        let call = function (data) {
            let store = Pack.Parse(data)
            if (store['error']) {
                console.log('error ' + store['error'])
                return
            }
            if (store['ticket']) {
                self.ticket = store['ticket']
                localStorage.setItem('user', self.name)
                localStorage.setItem('ticket', self.ticket)
            }
        }
        let data = `req:sign-in|user:${this.name}|password:${this.password}|`
        Network.Request(data, call)
        this.password = null
    }
    request_sign_up() {
        if (this.name === null || this.name === '') {
            this.name = 'hello'
        }
        if (this.password === null || this.password === '') {
            this.password = 'password'
        }

        let self = this
        let call = function (data) {
            let store = Pack.Parse(data)
            if (store['error']) {
                console.log('error ' + store['error'])
                return
            }
            if (store['ticket']) {
                self.ticket = store['ticket']
                localStorage.setItem('user', self.name)
                localStorage.setItem('ticket', self.ticket)
            }
        }
        let data = `req:sign-up|user:${this.name}|password:${this.password}|`
        Network.Request(data, call)
        this.password = null
    }
    request_sign_out() {
        let data = `req:sign-out|user:${this.name}|ticket:${this.ticket}|`
        Network.Request(data, () => {})
        self.name = null
        self.ticket = null
        localStorage.removeItem('user')
        localStorage.removeItem('ticket')
    }
}