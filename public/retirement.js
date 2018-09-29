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
        this.withdraw_rate = new Field(group, form, 'withdraw', 'Withdraw Rate %', '4.0')
        this.death = new Field(group, form, 'death', 'Age to Live', '120')

        let calculate = new Button('Calculate', function () {
            let valid = true
            for (let key in self.form) {
                if (self.form[key].invalid()) {
                    valid = false
                }
            }
            if (valid) {
                self.do_calculate(app)
            }
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
    do_calculate(app) {
        this.save_data(app)

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
        let death_value = parseFloat(this.death.input.value)

        let assets_required = expense_value / withdraw_rate_value
        let retirement_age = age_value
        let net_assets = this.net_worth(current_cash_value, current_stocks_value, current_bonds_value)

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
        this.new_table_cell(row, 'Age')
        let lastRightCell = this.new_table_cell(row, 'Status')

        lastLeftCell.style.borderTopLeftRadius = '0.2rem'
        lastRightCell.style.borderTopRightRadius = '0.2rem'

        graph.appendChild(row)

        row = document.createElement('div')
        row.style.display = 'table-row'
        row.style.backgroundColor = 'rgb(212, 236, 250)'

        lastLeftCell = this.new_table_cell(row, Application.Dollar(current_cash_value))
        this.new_table_cell(row, Application.Dollar(current_stocks_value))
        this.new_table_cell(row, Application.Dollar(current_bonds_value))
        this.new_table_cell(row, Application.Dollar(net_assets))
        this.new_table_cell(row, Application.Dollar(expense_value))
        this.new_table_cell(row, retirement_age)
        lastRightCell = this.new_table_cell(row, 'Working')

        graph.appendChild(row)

        while (net_assets < assets_required && current_cash_value > 0 && retirement_age < death_value) {

            current_cash_value += annual_cash_saved_value
            current_stocks_value += annual_stock_invested_value
            current_bonds_value += annual_bond_invested_value

            current_cash_value *= 1.0 + cash_return_value
            current_stocks_value *= 1.0 + stock_return_value
            current_bonds_value *= 1.0 + bond_return_value
            net_assets = this.net_worth(current_cash_value, current_stocks_value, current_bonds_value)

            expense_value *= 1.0 + inflation_value
            assets_required = expense_value / withdraw_rate_value

            retirement_age++

            row = document.createElement('div')
            row.style.display = 'table-row'
            row.style.backgroundColor = 'rgb(212, 236, 250)'

            lastLeftCell = this.new_table_cell(row, Application.Dollar(current_cash_value))
            this.new_table_cell(row, Application.Dollar(current_stocks_value))
            this.new_table_cell(row, Application.Dollar(current_bonds_value))
            this.new_table_cell(row, Application.Dollar(net_assets))
            this.new_table_cell(row, Application.Dollar(expense_value))
            this.new_table_cell(row, retirement_age)
            lastRightCell = this.new_table_cell(row, 'Working')

            graph.appendChild(row)
        }

        row.style.backgroundColor = 'var(--main-color)'

        while (retirement_age < death_value) {

            current_cash_value -= expense_value
            if (current_cash_value < 0) {
                current_stocks_value += current_cash_value
                current_cash_value = 0
            }

            current_cash_value *= 1.0 + cash_return_value
            current_stocks_value *= 1.0 + stock_return_value
            current_bonds_value *= 1.0 + bond_return_value
            net_assets = this.net_worth(current_cash_value, current_stocks_value, current_bonds_value)

            expense_value *= 1.0 + inflation_value

            retirement_age++

            row = document.createElement('div')
            row.style.display = 'table-row'
            row.style.backgroundColor = 'rgb(212, 236, 250)'

            lastLeftCell = this.new_table_cell(row, Application.Dollar(current_cash_value))
            this.new_table_cell(row, Application.Dollar(current_stocks_value))
            this.new_table_cell(row, Application.Dollar(current_bonds_value))
            this.new_table_cell(row, Application.Dollar(net_assets))
            this.new_table_cell(row, Application.Dollar(expense_value))
            this.new_table_cell(row, retirement_age)
            lastRightCell = this.new_table_cell(row, 'Retired')

            graph.appendChild(row)
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
        }
        let data = `req:get-retire|user:${app.user.name}|ticket:${app.user.ticket}|`
        Network.Request(data, call)
    }
}