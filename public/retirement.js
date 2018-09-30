class Retirement {
    constructor(app) {
        let self = this
        this.name = 'Retirement'
        this.link = 'retirement'

        let element = document.createElement('div')
        element.classList.add('content')

        let group = document.createElement('div')
        group.classList.add('input-group')

        let form = new Map()
        this.form = form

        this.inflation = new Field(group, form, 'inflation', 'Annual Inflation %', '2.0')
        this.stock_return = new Field(group, form, 'stock.return', 'Annual Stock Return %', '10.0')
        this.bond_return = new Field(group, form, 'bond.return', 'Annual Bond Return %', '6.0')
        this.cash_return = new Field(group, form, 'cash.return', 'Annual Cash Return %', '1.8')
        this.current_cash = new Field(group, form, 'current.cash', 'Current Cash $', '')
        this.current_stocks = new Field(group, form, 'current.stocks', 'Current Stocks $', '')
        this.current_bonds = new Field(group, form, 'current.bonds', 'Current Bonds $', '')
        this.annual_cash_saved = new Field(group, form, 'annual.cash', 'Annual Cash Saved $', '')
        this.annual_stock_invested = new Field(group, form, 'annual.stocks', 'Annual Stocks Invested $', '')
        this.annual_bond_invested = new Field(group, form, 'annual.bonds', 'Annual Bonds Invested $', '')
        this.expenses = new Field(group, form, 'expenses', 'Expenses $', '')
        this.age = new Field(group, form, 'age', 'Current Age', '')
        this.death = new Field(group, form, 'death', 'Age to Live', '120')

        let calculate = new Button('Calculate', function () {
            self.try_calculate(app)
        })

        let graph = document.createElement('div')
        graph.style.display = 'table'
        graph.style.width = '100%'
        graph.style.height = '100%'
        graph.style.marginTop = '1rem'
        graph.style.marginBottom = '1rem'

        element.appendChild(group)
        element.appendChild(calculate.element)
        element.appendChild(graph)

        this.graph = graph
        this.element = element
        this.calculate = calculate
    }
    update(app) {
        this.request_data(app)
    }
    net_worth(cash, stocks, bonds) {
        return cash + stocks + bonds
    }
    new_table_cell(row, content) {
        let cell = document.createElement('div')
        cell.style.display = 'table-cell'
        cell.style.padding = '0.5rem'
        cell.style.color = 'black'
        cell.style.textAlign = 'left'
        cell.style.verticalAlign = 'middle'
        cell.textContent = content
        row.appendChild(cell)
        return cell
    }
    try_calculate(app) {
        let valid = true
        for (let key in this.form) {
            if (this.form[key].invalid()) {
                valid = false
            }
        }
        if (valid) {
            this.do_calculate(app)
        }
    }
    do_calculate(app) {
        this.save_data(app)

        let inflation_value = 1.0 + parseFloat(this.inflation.input.value) / 100.0
        let stock_return_value = 1.0 + parseFloat(this.stock_return.input.value) / 100.0
        let bond_return_value = 1.0 + parseFloat(this.bond_return.input.value) / 100.0
        let cash_return_value = 1.0 + parseFloat(this.cash_return.input.value) / 100.0
        let current_cash_value = parseFloat(this.current_cash.input.value)
        let current_stocks_value = parseFloat(this.current_stocks.input.value)
        let current_bonds_value = parseFloat(this.current_bonds.input.value)
        let annual_cash_saved_value = parseFloat(this.annual_cash_saved.input.value)
        let annual_stock_invested_value = parseFloat(this.annual_stock_invested.input.value)
        let annual_bond_invested_value = parseFloat(this.annual_bond_invested.input.value)
        let expense_value = parseFloat(this.expenses.input.value)
        let age_value = parseFloat(this.age.input.value)
        let death_value = parseFloat(this.death.input.value)

        let age = age_value
        let assets_required = new Map()
        let expense_table = new Map()

        while (age <= death_value) {
            expense_table[age] = expense_value
            expense_value *= inflation_value
            age++
        }

        age = death_value
        assets_required[age] = expense_table[age]
        age--
        while (age >= age_value) {
            assets_required[age] = assets_required[age + 1] / stock_return_value + expense_table[age]
            age--
        }
        age = age_value

        let graph = this.graph
        while (graph.firstChild) {
            graph.removeChild(graph.firstChild)
        }

        let row = document.createElement('div')
        row.style.display = 'table-row'
        row.style.backgroundColor = 'rgb(212, 236, 250)'

        let lastLeftCell = this.new_table_cell(row, 'Cash')
        this.new_table_cell(row, 'Stocks')
        this.new_table_cell(row, 'Bonds')
        this.new_table_cell(row, 'Net Assets')
        this.new_table_cell(row, 'Expenses')
        this.new_table_cell(row, 'Target')
        this.new_table_cell(row, 'Age')
        let lastRightCell = this.new_table_cell(row, 'Status')

        lastLeftCell.style.borderTopLeftRadius = '0.2rem'
        lastRightCell.style.borderTopRightRadius = '0.2rem'

        graph.appendChild(row)

        let retired = false

        while (age <= death_value) {

            let current_assets = current_cash_value + current_stocks_value + current_bonds_value
            let current_expenses = expense_table[age]
            let current_assets_required = assets_required[age]

            row = document.createElement('div')
            row.style.display = 'table-row'
            row.style.backgroundColor = 'rgb(212, 236, 250)'

            lastLeftCell = this.new_table_cell(row, Application.Dollar(current_cash_value))
            this.new_table_cell(row, Application.Dollar(current_stocks_value))
            this.new_table_cell(row, Application.Dollar(current_bonds_value))
            this.new_table_cell(row, Application.Dollar(current_assets))
            this.new_table_cell(row, Application.Dollar(current_expenses))
            this.new_table_cell(row, Application.Dollar(current_assets_required))
            this.new_table_cell(row, age)

            let status
            if (retired) {
                // current_cash_value -= current_expenses
                // if (current_cash_value < 0) {
                //     current_bonds_value += current_cash_value
                //     current_cash_value = 0
                // }
                // if (current_bonds_value < 0) {
                //     current_stocks_value += current_bonds_value
                //     current_bonds_value = 0
                // }
                status = 'Retired'
                current_stocks_value -= current_expenses
                current_cash_value *= cash_return_value
                current_stocks_value *= stock_return_value
                current_bonds_value *= bond_return_value

            } else if (current_stocks_value >= current_assets_required) {
                retired = true
                row.style.backgroundColor = 'var(--main-color)'

                status = 'Retired'
                current_stocks_value -= current_expenses
                current_cash_value *= cash_return_value
                current_stocks_value *= stock_return_value
                current_bonds_value *= bond_return_value

            } else {
                status = 'Working'
                current_cash_value *= cash_return_value
                current_stocks_value *= stock_return_value
                current_bonds_value *= bond_return_value
                current_cash_value += annual_cash_saved_value
                current_stocks_value += annual_stock_invested_value
                current_bonds_value += annual_bond_invested_value
            }

            lastRightCell = this.new_table_cell(row, status)
            graph.appendChild(row)

            age++
        }

        lastLeftCell.style.borderBottomLeftRadius = '0.2rem'
        lastRightCell.style.borderBottomRightRadius = '0.2rem'
    }
    save_data(app) {
        if (app.user.not_in())
            return
        let call = function (data) {
            let store = Pack.Parse(data)
            if (store['error']) {
                console.log(`error ${store['error']}`)
                return
            }
        }
        let data = `req:save-retire|user:${app.user.name}|ticket:${app.user.ticket}|`
        for (let key in this.form) {
            let field = this.form[key]
            data += `${field.name}:${field.input.value}|`
        }
        Network.Request(data, call)
    }
    request_data(app) {
        if (app.user.not_in())
            return
        let self = this
        let call = function (data) {
            let store = Pack.Parse(data)
            if (store['error']) {
                console.log(`error ${store['error']}`)
                return
            }
            for (let key in self.form) {
                if (store[key]) {
                    self.form[key].input.value = store[key]
                }
            }
            self.try_calculate(app)
        }
        let data = `req:get-retire|user:${app.user.name}|ticket:${app.user.ticket}|`
        Network.Request(data, call)
    }
}