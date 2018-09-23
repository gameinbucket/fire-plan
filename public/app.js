class Application {
    constructor() {
        this.user = new User('user', 'ticket')
        this.budget_page = null
        this.retire_page = null
        this.active_page = null
        this.dashboard_page = new Dashboard(this)
        this.navigation = new Navigation(this)
        this.information = new Information(this)

        document.body.appendChild(this.navigation.element)
        document.body.appendChild(this.information.element)
    }
    import_script(src, call) {
        let script = document.createElement('script')
        script.src = src
        script.async = false
        script.onreadystatechange = call
        script.onload = call
        document.head.appendChild(script)
    }
    switch_dashboard(pop) {
        this.page_switch(this.dashboard_page, pop)
    }
    switch_retire_page(pop) {
        if (this.retire_page) {
            this.page_switch(this.retire_page, pop)
        } else {
            let self = this
            this.import_script('retirement.js', function () {
                self.retire_page = new Retirement(self)
                self.page_switch(self.retire_page, pop)
            })
        }
    }
    switch_budget_page(pop) {
        if (this.budget_page) {
            this.page_switch(this.budget_page, pop)
        } else {
            let self = this
            this.import_script('budget.js', function () {
                self.budget_page = new Budget(self)
                self.page_switch(self.budget_page, pop)
            })
        }
    }
    page_switch(to, pop) {
        if (this.active_page === to) {
            return
        }
        if (this.active_page) {
            document.body.removeChild(this.active_page.page)
        }
        this.active_page = to
        document.title = 'Fire Plan ' + to.name
        document.body.appendChild(to.page)
        this.information.label.textContent = to.name
        if (!pop) {
            history.pushState(null, null, to.link)
        }
    }
    browser_navigation(pop) {
        if (document.location.pathname === '/') {
            this.switch_dashboard(pop)
        } else if (document.location.pathname === '/retirement') {
            this.switch_retire_page(pop)
        } else if (document.location.pathname === '/budget') {
            this.switch_budget_page(pop)
        }
    }
}
window.onload = function () {
    let app = new Application()
    window.onpopstate = function (event) {
        app.browser_navigation(true)
    }

    if (document.location.pathname === '/retirement') {
        app.import_script('retirement.js', function () {
            app.retire_page = new Retirement(app)

            let to = app.retire_page
            app.active_page = to
            document.title = 'Fire Plan ' + to.name
            document.body.appendChild(to.page)
            app.information.label.textContent = to.name
        })

    } else if (document.location.pathname === '/budget') {
        app.import_script('budget.js', function () {
            app.budget_page = new Budget(app)

            let to = app.budget_page
            app.active_page = to
            document.title = 'Fire Plan ' + to.name
            document.body.appendChild(to.page)
            app.information.label.textContent = to.name
        })
    } else {
        let to = app.dashboard_page
        app.active_page = to
        document.title = 'Fire Plan ' + to.name
        document.body.appendChild(to.page)
        app.information.label.textContent = to.name
    }

    /* if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service.js').then((registration) => {
            console.log('service worker registered ', registration);
        }).catch((error) => {
            console.log('failed service worker registration', error);
        });
    } */
}