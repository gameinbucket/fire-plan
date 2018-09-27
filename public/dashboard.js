class Dashboard {
    constructor(app) {
        let self = this
        this.name = 'Dashboard'
        this.link = '/'

        let element = document.createElement('div')
        this.element = element
        element.classList.add('content')

        let retirement = document.createElement('div')
        retirement.textContent = 'Retirement'
        retirement.classList.add('goto')
        retirement.onclick = function () {
            app.switch_page('retirement', true)
        }

        let budget = document.createElement('div')
        budget.textContent = 'Budget'
        budget.classList.add('goto')
        budget.onclick = function () {
            app.switch_page('budget', true)
        }

        element.appendChild(retirement)
        element.appendChild(budget)
    }
}