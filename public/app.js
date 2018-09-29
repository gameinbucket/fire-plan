class Application {
    constructor() {
        this.user = new User('user', 'ticket')
        this.dashboard_page = null
        this.budget_page = null
        this.retire_page = null
        this.register_page = null
        this.login_page = null
        this.active_page = null
        this.pages = new Map()
        this.navigation = new Navigation(this)
        this.information = new Information(this)

        document.body.appendChild(this.navigation.element)
        document.body.appendChild(this.information.element)
    }
    static Currency(float) {
        return float.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
    }
    static Dollar(float) {
        return '$ ' + Application.Currency(float)
    }
    static ImportScript(src, call) {
        const script = document.createElement('script')
        script.src = src
        script.async = false
        script.onreadystatechange = call
        script.onload = call
        document.head.appendChild(script)
    }
    static NewPage(app, id) {
        switch (id) {
            case 'dashboard':
                return new Dashboard(app)
            case 'login':
                return new Login(app)
            case 'register':
                return new Register(app)
            case 'retirement':
                return new Retirement(app)
            case 'budget':
                return new Budget(app)
        }
    }
    switch_page(id, push) {
        if (this.pages[id]) {
            this.swap_page_elements(this.pages[id], push)
        } else {
            let self = this
            Application.ImportScript(id + '.js', function () {
                self.pages[id] = Application.NewPage(self, id)
                self.swap_page_elements(self.pages[id], push)
            })
        }
    }
    swap_page_elements(to, push) {
        if (this.active_page === to) {
            return
        }
        if (this.active_page) {
            document.body.removeChild(this.active_page.element)
        }
        to.update(this)
        this.active_page = to
        document.body.appendChild(to.element)
        this.information.label.textContent = to.name
        if (push) {
            history.pushState(null, null, to.link)
        }
    }
    browser_navigation(pop) {
        switch (document.location.pathname) {
            case '/':
                this.switch_page('dashboard', pop)
                break
            case '/retirement':
                this.switch_page('retirement', pop)
                break
            case '/budget':
                this.switch_page('budget', pop)
                break
            case '/register':
                this.switch_page('register', pop)
                break
            case '/login':
                this.switch_page('login', pop)
                break
        }
    }
    search(text) {
        console.log('searching', text)
    }
}
window.onload = function () {
    let app = new Application()
    window.onpopstate = function (event) {
        app.browser_navigation(false)
    }

    app.browser_navigation(false)

    const service = false
    if (service && 'serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service.js').then((registration) => {
            console.log('service worker registered ', registration);
        }).catch((error) => {
            console.log('failed service worker registration', error);
        });
    }
}