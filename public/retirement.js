class Retirement {
    constructor() {
        let self = this

        let page = document.createElement('div')
        page.classList.add('content')

        let group = document.createElement('div')
        group.classList.add('input-group')

        this.inflation = new Field(group, 'Annual Inflation %', '2.0')
        this.stock_return = new Field(group, 'Annual Stock Return %', '10.0')
        this.bond_return = new Field(group, 'Annual Bond Return %', '6.0')
        this.cash_return = new Field(group, 'Annual Cash Return %', '1.8')
        this.current_cash = new Field(group, 'Current Cash $', '')
        this.current_stocks = new Field(group, 'Current Stocks $', '')
        this.current_bonds = new Field(group, 'Current Bonds $', '')
        this.annual_cash_saved = new Field(group, 'Annual Cash Saved $', '')
        this.annual_stock_invested = new Field(group, 'Annual Stocks Invested $', '')
        this.annual_bond_invested = new Field(group, 'Annual Bonds Invested $', '')
        this.expenses = new Field(group, 'Retirement Expenses $', '')
        this.age = new Field(group, 'Current Age', '')

        this.death = new Field(group, 'Expected Age to Live', '120')
        this.death.div.style.display = 'none'

        this.specify_death = document.createElement('input')
        this.specify_death.classList.add('in')
        this.specify_death.setAttribute('type', 'radio')
        this.specify_death.setAttribute('name', 'end-age')
        this.specify_death.setAttribute('value', 'specify-age')
        this.specify_death.innerHTML = 'specify age'
        this.specify_death.onclick = function() {
            self.death.div.style.display = 'inline-block'
        }
        group.appendChild(this.specify_death)

        this.never_deplete = document.createElement('input')
        this.never_deplete.classList.add('in')
        this.never_deplete.setAttribute('type', 'radio')
        this.never_deplete.setAttribute('name', 'end-age')
        this.never_deplete.setAttribute('value', 'never-deplete')
        this.never_deplete.setAttribute('checked', '')
        this.never_deplete.innerHTML = 'never deplete'
        this.never_deplete.onclick = function() {
            self.death.div.style.display = 'none'
        }
        group.appendChild(this.never_deplete)

        this.withdraw_rate = new Field(group, 'Withdraw Rate %', '4.0')

        this.form = [
            this.inflation,
            this.stock_return,
            this.bond_return,
            this.cash_return,
            this.withdraw_rate,
            this.current_cash,
            this.current_stocks,
            this.current_bonds,
            this.annual_cash_saved,
            this.annual_stock_invested,
            this.annual_bond_invested,
            this.expenses,
            this.age
        ]

        this.calculate = document.createElement('button')
        this.calculate.innerHTML = 'Calculate'
        this.calculate.classList.add('do')
        this.calculate.onclick = function() {
            let valid = true
            for (let i = 0; i < self.form.length; i++) {
                if (self.form[i].invalid()) {
                    valid = false
                }
            }
            if (valid) {
                self.do_calculate()
            }
        }

        page.appendChild(group)
        page.appendChild(this.calculate)

        this.result = null
        this.page = page
    }   
    net_worth(cash, stocks, bonds) {
        return cash + stocks + bonds
    }
    do_calculate() {
        let inflation_value = parseFloat(this.inflation.input.value) / 100.0
        let stock_return_value = parseFloat(this.stock_return.input.value) / 100.0
        let bond_return_value = parseFloat(this.bond_return.input.value) / 100.0
        let cash_return_value = parseFloat(this.cash_return.input.value) / 100.0
        let withdraw_rate_value = parseFloat(this.withdraw_rate.input.value) / 100.0
        let current_cash_value = parseFloat(this.current_cash.input.value)
        let current_stocks_value = parseFloat(this.current_stocks.input.value)
        let current_bonds_value = parseFloat(this.current_bonds.input.value)
        let annual_cash_saved_value = parseFloat(this.annual_cash_saved.input.value)
        let annual_stock_invested_value = parseFloat(this.annual_stock_invested.input.value)
        let annual_bond_invested_value = parseFloat(this.annual_bond_invested.input.value)
        let expense_value = parseFloat(this.expenses.input.value)
        let age_value = parseFloat(this.age.input.value)

        let assets_required = expense_value / withdraw_rate_value
        let retirement_age = age_value

        while (this.net_worth(current_cash_value, current_stocks_value, current_bonds_value) < assets_required && current_cash_value > 0 && retirement_age < 999) {

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

        if (this.result === null) {
            this.result = document.createElement('div')
            this.page.appendChild(this.result)
        }

        if (retirement_age === 999) {
            retirement_age = 'Not able to retire.'
        }

        this.result.innerHTML = `Assets required: $ ${assets_required.toLocaleString()} Retirement Age: ${retirement_age}`
    }
    plot() {
        let expense_list = [expense_value]
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
        image.src = canvas.toDataURL()
    }
}