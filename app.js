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

function get_retire_page() {
    if (retire_page) {
        return retire_page
    }

    let page = document.createElement('div')

    let goto_home = document.createElement('div')
    goto_home.innerHTML = 'home'
    goto_home.style.cursor = 'pointer'
    goto_home.onclick = function() {
        page_switch(get_home_page())
    }
    page.appendChild(goto_home)

    let inflation = document.createElement('input')
    inflation.setAttribute('type', 'text')
    inflation.setAttribute('placeholder', 'average annual inflation %')
    inflation.style.display = 'block'
    page.appendChild(inflation)

    let stock_yield = document.createElement('input')
    stock_yield.setAttribute('type', 'text')
    stock_yield.setAttribute('placeholder', 'average annual stock yield %')
    stock_yield.style.display = 'block'
    page.appendChild(stock_yield)

    let bond_yield = document.createElement('input')
    bond_yield.setAttribute('type', 'text')
    bond_yield.setAttribute('placeholder', 'average annual bond yield %')
    bond_yield.style.display = 'block'
    page.appendChild(bond_yield)

    let savings = document.createElement('input')
    savings.setAttribute('type', 'text')
    savings.setAttribute('placeholder', 'current cash savings')
    savings.onkeydown = integer_filter
    page.appendChild(savings)

    let stocks = document.createElement('input')
    stocks.setAttribute('type', 'text')
    stocks.setAttribute('placeholder', 'current stocks')
    stocks.onkeydown = integer_filter
    page.appendChild(stocks)

    let bonds = document.createElement('input')
    bonds.setAttribute('type', 'text')
    bonds.setAttribute('placeholder', 'current bonds')
    bonds.onkeydown = integer_filter
    page.appendChild(bonds)

    let yearly_savings = document.createElement('input')
    yearly_savings.setAttribute('type', 'text')
    yearly_savings.setAttribute('placeholder', 'yearly cash savings')
    yearly_savings.onkeydown = integer_filter
    page.appendChild(yearly_savings)

    let yearly_stocks = document.createElement('input')
    yearly_stocks.setAttribute('type', 'text')
    yearly_stocks.setAttribute('placeholder', 'yearly invested stocks')
    yearly_stocks.onkeydown = integer_filter
    page.appendChild(yearly_stocks)

    let yearly_bonds = document.createElement('input')
    yearly_bonds.setAttribute('type', 'text')
    yearly_bonds.setAttribute('placeholder', 'yearly invested bonds')
    yearly_bonds.onkeydown = integer_filter
    page.appendChild(yearly_bonds)

    let expenses = document.createElement('input')
    expenses.setAttribute('type', 'text')
    expenses.setAttribute('placeholder', 'yearly expenses')
    page.appendChild(expenses)

    let age = document.createElement('input')
    age.setAttribute('type', 'text')
    age.setAttribute('placeholder', 'current age')
    page.appendChild(age)

    let death = document.createElement('input')
    death.setAttribute('type', 'text')
    death.setAttribute('placeholder', 'expected age to live until')
    death.style.display = 'none'
    page.appendChild(death)

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

    let withdraw = document.createElement('input')
    withdraw.setAttribute('type', 'text')
    withdraw.setAttribute('placeholder', 'safe withdraw rate %')
    page.appendChild(withdraw)

    let result = null
    let image = null

    let calculate = document.createElement('button')
    calculate.innerHTML = 'calculate'
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
    header.innerHTML = 'fire plan'
    page.appendChild(header)

    let goto_fire = document.createElement('div')
    goto_fire.innerHTML = 'retirement calculator'
    goto_fire.style.cssText = 'cursor:pointer; padding:1rem; border:0; border-radius:0.25rem; background-color:rgb(250, 86, 24); text-align:center;'
    goto_fire.onmouseover = function() {
        goto_fire.style.color = 'red'
    }
    goto_fire.onmouseleave = function() {
        goto_fire.style.color = 'black'
    }
    goto_fire.onclick = function() {
        page_switch(get_retire_page())
    }
    page.appendChild(goto_fire)

    home_page = page
    return page
}

function page_switch(to) {
    body.removeChild(active_page)
    body.appendChild(to)
    active_page = to
}

let navbar = document.createElement('div')
navbar.style.cssText = 'background-color:rgb(128, 128, 255); padding:1rem'

let goto_home = document.createElement('div')
goto_home.innerHTML = 'home'
goto_home.style.cursor = 'pointer'
goto_home.onclick = function() {
    page_switch(get_home_page())
}
navbar.appendChild(goto_home)

let retire_page = null
let home_page = null
let active_page = get_home_page()
body.appendChild(navbar)
body.appendChild(active_page)
