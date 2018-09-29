class Login {
    constructor(app) {
        let self = this
        this.name = 'Sign In'
        this.link = 'login'

        let element = document.createElement('div')
        element.classList.add('content')

        let group = document.createElement('div')
        group.classList.add('input-group')

        let form = new Map()

        this.email = new Field(group, form, 'email', 'Email', '')
        this.password = new PasswordField(group, form, 'password', 'Password', '')

        let create = new Button('Continue', function () {
            let valid = true
            for (let key in self.form) {
                if (self.form[key].invalid()) {
                    valid = false
                }
            }
            if (valid) {
                app.user.name = self.email.input.value
                app.user.password = self.password.input.value
                app.user.request_sign_in(function () {
                    app.navigation.profile_bar.update_display(app)
                    app.switch_page('dashboard', true)
                })
            }
        })

        element.appendChild(group)
        element.appendChild(create.element)

        this.form = form
        this.create = create
        this.element = element
    }
    update(app) {

    }
}