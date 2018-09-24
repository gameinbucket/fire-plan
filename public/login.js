class Login {
    constructor(app) {
        this.element = document.createElement('div')
        this.update_display(app)
    }
    update_display(app) {
        if (app.user.ticket === null) {
            this.display_register(app)
        } else {
            this.display_details(app)
        }
    }
    display_register(app) {
        let self = this
        let sign_in = document.createElement('a')
        sign_in.classList.add('sign')
        sign_in.textContent = 'Sign in'
        sign_in.onclick = function () {
            app.user.request_sign_in(function () {
                self.update_display(app)
            })
        }
        let sign_up = document.createElement('a')
        sign_up.classList.add('sign')
        sign_up.textContent = 'Sign up'
        sign_up.onclick = function () {
            app.switch_register(false)
        }
        let or = document.createElement('span')
        or.textContent = ' or '
        while (this.element.firstChild) {
            this.element.removeChild(this.element.firstChild)
        }

        this.element.appendChild(sign_in)
        this.element.appendChild(or)
        this.element.appendChild(sign_up)
    }
    display_details(app) {
        let self = this
        let sign_out = document.createElement('a')
        sign_out.classList.add('sign')
        sign_out.textContent = 'Sign out'
        sign_out.onclick = function () {
            app.user.request_sign_out()
            self.update_display(app)
        }
        while (this.firstChild) {
            this.element.removeChild(this.sign.firstChild)
        }
        this.element.appendChild(sign_out)
    }
}