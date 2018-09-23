class Navigation {
    constructor(app) {
        let bar = document.createElement('div')
        bar.classList.add('nav')

        let title = document.createElement('div')
        title.classList.add('title')
        title.textContent = 'Fire Plan'
        title.onclick = function () {
            app.switch_dashboard(false)
        }

        let search = document.createElement('input')
        search.classList.add('search')
        search.setAttribute('type', 'text')
        search.setAttribute('placeholder', 'Search')

        this.sign = document.createElement('div')
        this.update_sign_in_out(app.user)

        search.classList.add('search')
        search.setAttribute('type', 'text')
        search.setAttribute('placeholder', 'Search')

        bar.appendChild(title)
        bar.appendChild(search)
        bar.appendChild(this.sign)

        this.element = bar
    }
    update_sign_in_out(user) {
        if (user.ticket === null) {
            this.display_sign_in(user)
        } else {
            this.display_sign_out(user)
        }
    }
    display_sign_in(user) {
        let self = this
        let sign_in = document.createElement('a')
        sign_in.classList.add('sign')
        sign_in.textContent = 'Sign in'
        sign_in.onclick = function () {
            user.request_sign_in(() => {
                self.update_sign_in_out(user)
            })
        }
        let sign_up = document.createElement('a')
        sign_up.classList.add('sign')
        sign_up.textContent = 'Sign up'
        sign_up.onclick = function () {
            user.request_sign_up(() => {
                self.update_sign_in_out(user)
            })
        }
        let or = document.createElement('span')
        or.textContent = ' or '
        while (this.sign.firstChild) {
            this.sign.removeChild(this.sign.firstChild);
        }
        this.sign.appendChild(sign_in)
        this.sign.appendChild(or)
        this.sign.appendChild(sign_up)
    }
    display_sign_out(user) {
        let self = this
        let sign_out = document.createElement('a')
        sign_out.classList.add('sign')
        sign_out.textContent = 'Sign out'
        sign_out.onclick = function () {
            user.request_sign_out()
            self.update_sign_in_out(user)
        }
        while (this.sign.firstChild) {
            this.sign.removeChild(this.sign.firstChild);
        }
        this.sign.appendChild(sign_out)
    }
}

class Information {
    constructor(app) {
        let bar = document.createElement('div')
        bar.classList.add('info')

        let content = document.createElement('div')
        content.classList.add('content')

        let label = document.createElement('a')
        this.label = label
        label.classList.add('infotitle')

        content.appendChild(label)
        bar.appendChild(content)

        this.element = bar
    }
}