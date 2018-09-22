class Application {
    constructor() {
        this.user = new User('user', 'ticket')
        this.budget_page = null
        this.retire_page = null
        this.dashboard_page = new Dashboard(this)
        this.active_page = this.dashboard_page
        this.navigation = new Navigation(this)
        this.information = new Information(this)

        document.body.appendChild(this.navigation.element)
        document.body.appendChild(this.information.element)
        document.body.appendChild(this.active_page.page)
    }
    import_script(src, call) {
        let script = document.createElement('script')
        script.src = src
        script.async = false
        script.onreadystatechange = call
        script.onload = call
        document.head.appendChild(script)
    }
    switch_dashboard() {
        this.page_switch(this.dashboard_page)
    }
    switch_retire_page() {
        if (this.retire_page) {
            this.page_switch(this.retire_page)
        } else {
            let self = this
            this.import_script('retirement.js', function () {
                self.retire_page = new Retirement(self)
                self.page_switch(self.retire_page)
            })
        }
    }
    switch_budget_page() {
        if (this.budget_page) {
            this.page_switch(this.budget_page)
        } else {
            let self = this
            this.import_script('budget.js', function () {
                self.budget_page = new Budget(self)
                self.page_switch(self.budget_page)
            })
        }
    }
    page_switch(to) {
        document.body.removeChild(this.active_page.page)
        document.body.appendChild(to.page)
        this.active_page = to
        this.information.label.textContent = this.active_page.name
    }
}

window.onload = function () {
    new Application()
    /* if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service.js').then((registration) => {
            console.log('service worker registered ', registration);
        }).catch((error) => {
            console.log('failed service worker registration', error);
        });
    } */
}