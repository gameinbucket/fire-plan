const backspaceKey = 8
const deleteKey = 46
const body = document.body

function integer_filter(event) {
    let key = event.keyCode
    if (key === backspaceKey || key === deleteKey) {
        return
    } else if (key >= 47 && key <= 58) {
        return
    }
    event.preventDefault()
}

function get_budget_page() {
    if (budget_page) {
        return budget_page
    }

    let page = document.createElement('div')
    page.classList.add('content')
    page.innerHTML = 'budget'

    budget_page = page
    return page
}

function get_home_page() {
    if (home_page) {
        return home_page
    }

    let page = document.createElement('div')
    page.classList.add('content')
    
    let retirement = document.createElement('div')
    retirement.innerHTML = 'Retirement'
    retirement.classList.add('goto')
    retirement.onclick = function() {
        page_switch(get_retire_page())
    }
    
    let budget = document.createElement('div')
    budget.innerHTML = 'Budget'
    budget.classList.add('goto')
    budget.onclick = function() {
        page_switch(get_budget_page())
    }

    page.appendChild(retirement)
    page.appendChild(budget)

    home_page = page
    return page
}

function page_switch(to) {
    body.removeChild(active_page)
    body.appendChild(to)
    active_page = to
}

function get_retire_page() {
    if (retire_page) {
        return retire_page
    }
    retire_page = new Retirement()
    return retire_page.page
}

let user = new User()
user.name = 'godzilla'
user.ticket = localStorage.getItem('ticket')
let budget_page = null
let retire_page = null
let home_page = null
let active_page = get_home_page()

window.onload = function() {
    body.appendChild(get_nav())
    body.appendChild(get_info())
    body.appendChild(active_page)
}
