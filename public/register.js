class Register {
    constructor(app) {
        let self = this
        this.name = 'Register'
        this.link = 'register'

        let element = document.createElement('div')
        element.classList.add('content')

        let group = document.createElement('div')
        group.classList.add('input-group')

        let form = new Map()

        this.email = new Field(group, form, 'email', 'Email', '')
        this.password = new PasswordField(group, form, 'password', 'Password', '')
        this.confirm_password = new PasswordField(group, form, 'confirm.password', 'Confirm Password', '')

        let create = new Button('Create Account', function () {
            let valid = true
            for (let key in self.form) {
                if (self.form[key].invalid()) {
                    valid = false
                }
            }
            if (self.password.input.value !== self.confirm_password.input.value) {
                valid = false
                console.log(`password doesn't match`)
            }
            if (valid) {
                app.user.name = self.email.input.value
                app.user.password = self.password.input.value
                app.user.request_sign_up(function () {
                    app.navigation.profile_bar.update_display(app)
                    app.switch_dashboard(false)
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