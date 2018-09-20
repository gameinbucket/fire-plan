class Dashboard {
    constructor() {
        let self = this
        this.name = 'Dashboard'

        let page = document.createElement('div')
        this.page = page
        page.classList.add('content')
        
        let retirement = document.createElement('div')
        retirement.innerHTML = 'Retirement'
        retirement.classList.add('goto')
        retirement.onclick = function() {
            switch_retire_page()
        }
        
        let budget = document.createElement('div')
        budget.innerHTML = 'Budget'
        budget.classList.add('goto')
        budget.onclick = function() {
            switch_budget_page()
        }

        page.appendChild(retirement)
        page.appendChild(budget)
    }
}