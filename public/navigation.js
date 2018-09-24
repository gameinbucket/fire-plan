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

        let search_icon = document.createElement('img')
        search_icon.addEventListener('mouseover', function () {
            search_icon.style.cursor = 'pointer'
        })
        search_icon.addEventListener('mouseout', function () {
            search_icon.style.cursor = 'default'
        })
        search_icon.setAttribute('src', 'search.svg')
        search_icon.style.width = '1rem'
        search_icon.style.height = '1rem'
        search_icon.onclick = function () {
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

        let login = new Login(app)

        search.appendChild(search_icon)
        search.appendChild(search_input)
        search.appendChild(search_arrow)

        bar.appendChild(title)
        bar.appendChild(search)
        bar.appendChild(login.element)

        this.element = bar
        this.login = login
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