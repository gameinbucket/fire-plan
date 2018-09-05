function net_worth(cash, stocks, bonds) {
    return cash + stocks + bonds
}

function get_retire_page() {
    if (retire_page) {
        return retire_page
    }

    let page = document.createElement('div')
    page.classList.add('content')

    let group = document.createElement('div')
    group.classList.add('input-group')

    let inflation = new Field(group, 'Annual Inflation %', '2.0')
    let stock_return = new Field(group, 'Annual Stock Return %', '10.0')
    let bond_return = new Field(group, 'Annual Bond Return %', '6.0')
    let cash_return = new Field(group, 'Annual Cash Return %', '1.8')

    let current_cash = new Field(group, 'Current Cash $', '')
    let current_stocks = new Field(group, 'Current Stocks $', '')
    let current_bonds = new Field(group, 'Current Bonds $', '')

    let annual_cash_saved = new Field(group, 'Annual Cash Saved $', '')
    let annual_stock_invested = new Field(group, 'Annual Stocks Invested $', '')
    let annual_bond_invested = new Field(group, 'Annual Bonds Invested $', '')

    let expenses = new Field(group, 'Retirement Expenses $', '')
    let age = new Field(group, 'Current Age', '')

    let death = new Field(group, 'Expected Age to Live', '120')
    death.div.style.display = 'none'

    let specify_death = document.createElement('input')
    specify_death.classList.add('in')
    specify_death.setAttribute('type', 'radio')
    specify_death.setAttribute('name', 'end-age')
    specify_death.setAttribute('value', 'specify-age')
    specify_death.innerHTML = 'specify age'
    specify_death.onclick = function() {
        death.div.style.display = 'inline-block'
    }
    group.appendChild(specify_death)

    let never_deplete = document.createElement('input')
    never_deplete.classList.add('in')
    never_deplete.setAttribute('type', 'radio')
    never_deplete.setAttribute('name', 'end-age')
    never_deplete.setAttribute('value', 'never-deplete')
    never_deplete.setAttribute('checked', '')
    never_deplete.innerHTML = 'never deplete'
    never_deplete.onclick = function() {
        death.div.style.display = 'none'
    }
    group.appendChild(never_deplete)

    let withdraw_rate = new Field(group, 'Withdraw Rate %', '4.0')

    let result = null
    let image = null
    let calculate = document.createElement('button')
    calculate.innerHTML = 'Calculate'
    calculate.classList.add('do')
    calculate.onclick = function() {

        if (expenses.input.value === '') {
            expenses.label.style.color = 'red'
            return
        } else {
            expenses.label.style.color = 'black'
        }

        let inflation_value = parseFloat(inflation.input.value) / 100.0
        let stock_return_value = parseFloat(stock_return.input.value) / 100.0
        let bond_return_value = parseFloat(bond_return.input.value) / 100.0
        let cash_return_value = parseFloat(cash_return.input.value) / 100.0
        let withdraw_rate_value = parseFloat(withdraw_rate.input.value) / 100.0
        let current_cash_value = parseFloat(current_cash.input.value)
        let current_stocks_value = parseFloat(current_stocks.input.value)
        let current_bonds_value = parseFloat(current_bonds.input.value)
        let annual_cash_saved_value = parseFloat(annual_cash_saved.input.value)
        let annual_stock_invested_value = parseFloat(annual_stock_invested.input.value)
        let annual_bond_invested_value = parseFloat(annual_bond_invested.input.value)
        let expense_value = parseFloat(expenses.input.value)
        let age_value = parseFloat(age.input.value)

        let assets_required = expense_value / withdraw_rate_value
        let retirement_age = age_value

        while (net_worth(current_cash_value, current_stocks_value, current_bonds_value) < assets_required && current_cash_value > 0 && retirement_age < 999) {

            current_cash_value += annual_cash_saved_value
            current_stocks_value += annual_stock_invested_value
            current_bonds_value += annual_bond_invested_value

            current_cash_value *= 1.0 + cash_return_value
            current_stocks_value *= 1.0 + stock_return_value
            current_bonds_value *= 1.0 + bond_return_value

            expense_value *= 1.0 + inflation_value
            assets_required = expense_value / withdraw_rate_value

            retirement_age++
        }

        if (result === null) {
            result = document.createElement('div')
            page.appendChild(result)
        }

        if (retirement_age === 999) {
            retirement_age = 'Not able to retire.'
        }

        result.innerHTML = `Assets required: $ ${assets_required.toLocaleString()} Retirement Age: ${retirement_age}`

        /* let expense_list = [expense_value]
        for (let i = 1; i < 25; i++) {
            let current = expense_list[i - 1]
            expense_list[i] = current * (1.0 + inflation_value)
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
        image.src = canvas.toDataURL() */
    }

    page.appendChild(group)
    page.appendChild(calculate)

    retire_page = page
    return page
}