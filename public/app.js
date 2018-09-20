function import_script(src, call) {
    let script = document.createElement('script')
    script.src = src
    script.async = false
    script.onreadystatechange = call
    script.onload = call
    document.head.appendChild(script)
}

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

function get_dashboard() {
    dashboard_page = new Dashboard()
    return dashboard_page
}

function switch_dashboard() {
    page_switch(dashboard_page)
}

function switch_retire_page() {
    if (retire_page) {
        page_switch(retire_page)
    } else {
        import_script('retirement.js', function() {
            retire_page = new Retirement()
            page_switch(retire_page)
        })
    }
}

function switch_budget_page() {
    if (budget_page) {
        page_switch(budget_page)
    } else {
        import_script('budget.js', function() {
            budget_page = new Budget()
            page_switch(budget_page)
        })
    }
}

function page_switch(to) {
    body.removeChild(active_page.page)
    body.appendChild(to.page)
    active_page = to
    title_label.innerHTML = active_page.name
}

let user = new User()
user.name = 'godzilla'
user.ticket = localStorage.getItem('ticket')
let budget_page = null
let retire_page = null
let dashboard_page = null
let title_label = null
let active_page = get_dashboard()

window.onload = function() {
    body.appendChild(get_nav())
    body.appendChild(get_info())
    body.appendChild(active_page.page)
}
