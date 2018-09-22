class Dashboard {
    constructor(app) {
        let self = this
        this.name = 'Dashboard'

        let page = document.createElement('div')
        this.page = page
        page.classList.add('content')

        let retirement = document.createElement('div')
        retirement.textContent = 'Retirement'
        retirement.classList.add('goto')
        retirement.onclick = function () {
            app.switch_retire_page()
        }

        let budget = document.createElement('div')
        budget.textContent = 'Budget'
        budget.classList.add('goto')
        budget.onclick = function () {
            app.switch_budget_page()
        }

        page.appendChild(retirement)
        page.appendChild(budget)
    }
}