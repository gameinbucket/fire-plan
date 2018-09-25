class Navigation {
    constructor(app) {
        let bar = document.createElement('div')
        bar.classList.add('nav')

        let title = document.createElement('div')
        title.classList.add('title')
        title.onclick = function () {
            app.switch_dashboard(false)
        }
        title.onmouseover = function () {
            title.style.color = 'darkgray'
        }
        title.onmouseleave = function () {
            title.style.color = 'black'
        }

        let title_logo = document.createElement('img')
        title_logo.setAttribute('src', 'fire.svg')
        title_logo.style.width = '1.2rem'
        title_logo.style.height = '1.2rem'

        let title_name = document.createElement('span')
        title_name.textContent = 'Fire Plan'

        title.appendChild(title_logo)
        title.appendChild(title_name)

        let search = document.createElement('div')
        search.style.flex = '1'
        search.style.display = 'flex'
        search.style.alignItems = 'center'
        search.style.padding = '0.2rem 0.4rem'
        search.style.backgroundColor = 'rgb(246, 246, 246)'
        search.style.height = '1.5rem'
        search.style.borderRadius = '0.2rem'
        search.style.marginRight = 'var(--space)'
        search.addEventListener('mouseover', function () {
            search.style.backgroundColor = 'rgb(232, 232, 232)'
        })
        search.addEventListener('mouseout', function () {
            search.style.backgroundColor = 'rgb(246, 246, 246)'
        })

        let search_input = document.createElement('input')
        search_input.style.flex = '1'
        search_input.style.padding = '0.2rem 0.4rem '
        search_input.style.border = 'none'
        search_input.style.fontFamily = 'roboto'
        search_input.style.fontWeight = 'bold'
        search_input.style.color = 'var(--black-font)'
        search_input.style.backgroundColor = 'transparent'
        search_input.setAttribute('type', 'text')
        search_input.setAttribute('placeholder', 'Search')

        let dropdown_icon = document.createElement('img')
        dropdown_icon.addEventListener('mouseover', function () {
            dropdown_icon.style.cursor = 'pointer'
        })
        dropdown_icon.addEventListener('mouseout', function () {
            dropdown_icon.style.cursor = 'default'
        })
        dropdown_icon.setAttribute('src', 'search.svg')
        dropdown_icon.style.width = '1rem'
        dropdown_icon.style.height = '1rem'
        dropdown_icon.onclick = function () {
            app.search(search_input.value)
        }

        let search_arrow = document.createElement('img')
        search_arrow.addEventListener('mouseover', function () {
            search_arrow.style.cursor = 'pointer'
        })
        search_arrow.addEventListener('mouseout', function () {
            search_arrow.style.cursor = 'default'
        })
        search_arrow.setAttribute('src', 'arrow-right.svg')
        search_arrow.style.width = '1rem'
        search_arrow.style.height = '1rem'
        search_arrow.onclick = function () {
            app.search(search_input.value)
        }

        let profile_bar = new ProfileBar(app)

        search.appendChild(dropdown_icon)
        search.appendChild(search_input)
        search.appendChild(search_arrow)

        bar.appendChild(title)
        bar.appendChild(search)
        bar.appendChild(profile_bar.element)

        this.element = bar
        this.profile_bar = profile_bar
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

class ProfileBar {
    constructor(app) {
        this.element = document.createElement('div')
        this.update_display(app)
    }
    update_display(app) {
        while (this.element.firstChild) {
            this.element.removeChild(this.element.firstChild)
        }
        if (app.user.ticket === null) {
            this.display_register(app)
        } else {
            this.display_details(app)
        }
    }
    display_register(app) {
        let login = document.createElement('button')
        login.textContent = 'Log In'
        login.onclick = function () {
            app.switch_login(false)
        }
        login.style.marginRight = 'var(--space)'
        login.style.minWidth = '6rem'
        login.style.border = '1px solid var(--button-color-2)'
        login.style.backgroundColor = 'transparent'
        login.style.outline = 'none'
        login.style.borderRadius = '0.2rem'
        login.style.padding = '0.3rem 0.3rem'
        login.style.fontWeight = 'bold'
        login.style.color = 'var(--button-color-2)'
        login.style.fontFamily = 'roboto'
        login.addEventListener('mouseover', function () {
            login.style.cursor = 'pointer'
            login.style.borderColor = 'var(--button-color-3)'
            login.style.color = 'var(--button-color-3)'
        })
        login.addEventListener('mouseout', function () {
            login.style.cursor = 'default'
            login.style.borderColor = 'var(--button-color-2)'
            login.style.color = 'var(--button-color-2)'
        })

        let register = document.createElement('button')
        register.textContent = 'Register'
        register.onclick = function () {
            app.switch_register(false)
        }
        register.style.minWidth = '6rem'
        register.style.border = '1px solid var(--button-color-2)'
        register.style.backgroundColor = 'var(--button-color-2)'
        register.style.outline = 'none'
        register.style.borderRadius = '0.2rem'
        register.style.padding = '0.3rem 0.3rem'
        register.style.fontWeight = 'bold'
        register.style.color = 'white'
        register.style.fontFamily = 'roboto'
        register.addEventListener('mouseover', function () {
            register.style.cursor = 'pointer'
            register.style.borderColor = 'var(--button-color-3)'
            register.style.backgroundColor = 'var(--button-color-3)'
        })
        register.addEventListener('mouseout', function () {
            register.style.cursor = 'default'
            register.style.borderColor = 'var(--button-color-2)'
            register.style.backgroundColor = 'var(--button-color-2)'
        })

        this.element.appendChild(login)
        this.element.appendChild(register)
    }

    display_details(app) {
        let self = this

        let group = document.createElement('div')
        group.style.display = 'flex'
        group.style.alignItems = 'center'
        group.style.marginRight = 'var(--space)'
        group.style.minWidth = '6rem'
        group.style.border = '1px solid darkgray'
        group.style.backgroundColor = 'transparent'
        group.style.outline = 'none'
        group.style.borderRadius = '0.2rem'
        group.style.padding = '0.3rem 0.3rem'
        group.style.fontWeight = 'bold'
        group.style.fontSize = '0.75rem'
        group.style.color = 'darkgray'
        group.style.textAlign = 'left'
        group.style.fontFamily = 'roboto'
        group.addEventListener('mouseover', function () {
            group.style.cursor = 'pointer'
            group.style.borderColor = 'gray'
            group.style.color = 'gray'
        })
        group.addEventListener('mouseout', function () {
            group.style.cursor = 'default'
            group.style.borderColor = 'darkgray'
            group.style.color = 'darkgray'
        })
        group.onclick = function () {
            self.display_options(app)
        }

        let sign_out = document.createElement('span')
        sign_out.textContent = app.user.name
        sign_out.style.flex = '1'

        let profile_icon = document.createElement('img')
        profile_icon.setAttribute('src', 'user-astronaut.svg')
        profile_icon.style.width = '1rem'
        profile_icon.style.height = '1rem'

        let dropdown_icon = document.createElement('img')
        dropdown_icon.setAttribute('src', 'sign-out-alt.svg')
        dropdown_icon.style.width = '1rem'
        dropdown_icon.style.height = '1rem'

        group.appendChild(profile_icon)
        group.appendChild(sign_out)
        group.appendChild(dropdown_icon)

        this.element.appendChild(group)
    }
    display_options(app) {
        app.user.request_sign_out()
        this.update_display(app)
    }
}