function load_script(file) {
    let script = document.createElement('script');
    script.src = file
    document.body.appendChild(script);
}

load_script('buttons.js');

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
    page.innerHTML = 'budget'

    budget_page = page
    return page
}

function get_retire_page() {
    if (retire_page) {
        return retire_page
    }

    let page = document.createElement('div')

    make_text_value(page, 'Annual Inflation %', '2.0')
    make_text_value(page, 'Annual Stock Return %', '10.0')
    make_text_value(page, 'Annual Bond Return %', '6.0')
    make_text_value(page, 'Annual Cash Return %', '1.8')

    make_text(page, 'Current Cash')
    make_text(page, 'Current Stocks')
    make_text(page, 'Current Bonds')

    make_text(page, 'Annual Cash Saved')
    make_text(page, 'Annual Stocks Invested')
    make_text(page, 'Annual Bonds Invested')

    make_text(page, 'Retirement Expenses')
    make_text(page, 'Current Age')

    let death = make_text_value(page, 'Expected Age to Live', '100')
    death.style.display = 'none'

    let specify_death = document.createElement('input')
    specify_death.setAttribute('type', 'radio')
    specify_death.setAttribute('name', 'end-age')
    specify_death.setAttribute('value', 'specify-age')
    specify_death.innerHTML = 'specify age'
    specify_death.onclick = function() {
        death.style.display = 'block'
    }
    page.appendChild(specify_death)

    let never_deplete = document.createElement('input')
    never_deplete.setAttribute('type', 'radio')
    never_deplete.setAttribute('name', 'end-age')
    never_deplete.setAttribute('value', 'never-deplete')
    never_deplete.setAttribute('checked', '')
    never_deplete.innerHTML = 'never deplete'
    never_deplete.onclick = function() {
        death.style.display = 'none'
    }
    page.appendChild(never_deplete)

    make_text_value(page, 'Withdraw Rate %', '4.0')

    let result = null
    let image = null
    let calculate = document.createElement('button')
    calculate.innerHTML = 'Calculate'
    calculate.classList.add('do')
    calculate.onclick = function() {
        let calc = parseInt(expenses.value) * 25.0

        if (result === null) {
            result = document.createElement('div')
            page.appendChild(result)
        }
        result.innerHTML = `${calc}`
        
        let expense_value = parseFloat(expenses.value)

        let inflation = 0.02
        let expense_list = [expense_value]
        for (let i = 1; i < 25; i++) {
            let current = expense_list[i - 1]
            expense_list[i] = current * (1.0 + inflation)
        }

        let low = expense_value
        let high = expense_list[expense_list.length - 1]
        let range = high - low

        let canvas = document.createElement('canvas')
        let width = 200
        let height = 200
        canvas.width = width
        canvas.height = height
        let context = canvas.getContext('2d')
        let image_data = context.getImageData(0, 0, width, height)
        let data = image_data.data
        for (let i = 0; i < data.length; i += 4) {
            data[i] = 128
            data[i + 1] = 255
            data[i + 2] = 128
            data[i + 3] = 255
        }

        for (let x = 0; x < expense_list.length; x++) {
            let y = Math.floor((expense_list[x] - low) / range)
            let index = (x + y * width) * 4
            data[index] = 0
            data[index + 1] = 0
            data[index + 2] = 0
        }

        context.putImageData(image_data, 0, 0)

        if (image === null) {
            image = new Image()
            page.appendChild(image)
        }
        image.src = canvas.toDataURL()
    }
    page.appendChild(calculate)

    retire_page = page
    return page
}

function get_home_page() {
    if (home_page) {
        return home_page
    }

    let page = document.createElement('div')
    
    let header = document.createElement('h1')
    header.innerHTML = 'Fire Plan'
    page.appendChild(header)

    let goto_fire = document.createElement('div')
    goto_fire.innerHTML = 'Retirement'
    goto_fire.classList.add('goto')
    goto_fire.onclick = function() {
        page_switch(get_retire_page())
    }
    page.appendChild(goto_fire)

    let goto_budget = document.createElement('div')
    goto_budget.innerHTML = 'Budget'
    goto_budget.classList.add('goto')
    goto_budget.onclick = function() {
        page_switch(get_budget_page())
    }
    page.appendChild(goto_budget)

    home_page = page
    return page
}

function page_switch(to) {
    body.removeChild(active_page)
    body.appendChild(to)
    active_page = to
}

let navbar = document.createElement('div')
navbar.style.cssText = 'background-color: rgb(128, 128, 255); padding: 1rem'

let goto_home = document.createElement('div')
goto_home.innerHTML = 'Home'
goto_home.style.cursor = 'pointer'
goto_home.onclick = function() {
    page_switch(get_home_page())
}
navbar.appendChild(goto_home)

let budget_page = null
let retire_page = null
let home_page = null
let active_page = get_home_page()
body.appendChild(navbar)
body.appendChild(active_page)
