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
    switch_page(id, pop) {
        if (this.pages[id]) {
            this.swap_page_elements(this.pages[id], pop)
        } else {
            let self = this
            Application.ImportScript(id + '.js', function () {
                self.pages[id] = Application.NewPage(self, id)
                self.swap_page_elements(self.pages[id], pop)
            })
        }
    }
    swap_page_elements(to, pop) {
        if (this.active_page === to) {
            return
        }
        if (this.active_page) {
            document.body.removeChild(this.active_page.element)
        }
        this.active_page = to
        document.body.appendChild(to.element)
        this.information.label.textContent = to.name
        if (!pop) {
            history.pushState(null, null, to.link)
        }
    }
    browser_navigation(pop) {
        switch (document.location.pathname) {
            case '/':
                this.switch_dashboard(pop)
                break
            case '/retirement':
                this.switch_retire_page(pop)
                break
            case '/budget':
                this.switch_budget(pop)
                break
            case '/register':
                this.switch_register(pop)
                break
            case '/login':
                this.switch_login(pop)
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
        app.browser_navigation(true)
    }

    if (document.location.pathname === '/retirement') {
        Application.ImportScript('retirement.js', function () {
            app.retire_page = new Retirement(app)

            let to = app.retire_page
            app.active_page = to
            document.body.appendChild(to.element)
            app.information.label.textContent = to.name
        })

    } else if (document.location.pathname === '/budget') {
        Application.ImportScript('budget.js', function () {
            app.budget_page = new Budget(app)

            let to = app.budget_page
            app.active_page = to
            document.body.appendChild(to.element)
            app.information.label.textContent = to.name
        })
    } else if (document.location.pathname === '/register') {
        Application.ImportScript('register.js', function () {
            app.register_page = new Register(app)

            let to = app.register_page
            app.active_page = to
            document.body.appendChild(to.element)
            app.information.label.textContent = to.name
        })
    } else if (document.location.pathname === '/login') {
        Application.ImportScript('login.js', function () {
            app.login_page = new Login(app)

            let to = app.login_page
            app.login_page = to
            document.body.appendChild(to.element)
            app.information.label.textContent = to.name
        })
    } else {
        Application.ImportScript('dashboard.js', function () {
            app.dashboard_page = new Dashboard(app)

            let to = app.dashboard_page
            app.dashboard_page = to
            document.body.appendChild(to.element)
            app.information.label.textContent = to.name
        })
    }

    const service = false
    if (service && 'serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service.js').then((registration) => {
            console.log('service worker registered ', registration);
        }).catch((error) => {
            console.log('failed service worker registration', error);
        });
    }
}