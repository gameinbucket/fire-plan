class Budget {
    constructor(app) {
        let self = this
        this.name = 'Budget'
        this.link = 'budget'

        let element = document.createElement('div')
        this.element = element
        element.classList.add('content')

        element.appendChild(Budget.MakeInputElement())

        let table = document.createElement('div')
        table.style.display = 'table'
        table.style.width = '100%'
        table.style.height = '100%'

        let rowLabel = document.createElement('div')
        rowLabel.style.display = 'table-row'

        let nameLabel = document.createElement('div')
        nameLabel.style.display = 'table-cell'
        nameLabel.style.backgroundColor = 'lightgray'
        nameLabel.style.borderBottom = '1px solid black'
        nameLabel.style.padding = '0.5rem'
        nameLabel.style.color = 'black'
        nameLabel.style.textAlign = 'left'
        nameLabel.style.verticalAlign = 'middle'
        nameLabel.style.borderTopLeftRadius = '0.2rem'
        nameLabel.textContent = 'Name'

        let costLabel = document.createElement('div')
        costLabel.style.display = 'table-cell'
        costLabel.style.backgroundColor = 'lightgray'
        costLabel.style.borderBottom = '1px solid black'
        costLabel.style.padding = '0.5rem'
        costLabel.style.color = 'black'
        costLabel.style.textAlign = 'left'
        costLabel.style.verticalAlign = 'middle'
        costLabel.textContent = 'Cost'

        let categoryLabel = document.createElement('div')
        categoryLabel.style.display = 'table-cell'
        categoryLabel.style.backgroundColor = 'lightgray'
        categoryLabel.style.borderBottom = '1px solid black'
        categoryLabel.style.padding = '0.5rem'
        categoryLabel.style.color = 'black'
        categoryLabel.style.textAlign = 'left'
        categoryLabel.style.verticalAlign = 'middle'
        categoryLabel.textContent = 'Category'

        let dateLabel = document.createElement('div')
        dateLabel.style.display = 'table-cell'
        dateLabel.style.backgroundColor = 'lightgray'
        dateLabel.style.borderBottom = '1px solid black'
        dateLabel.style.padding = '0.5rem'
        dateLabel.style.color = 'black'
        dateLabel.style.textAlign = 'left'
        dateLabel.style.verticalAlign = 'middle'
        dateLabel.style.borderTopRightRadius = '0.2rem'
        dateLabel.textContent = 'Date'

        rowLabel.appendChild(nameLabel)
        rowLabel.appendChild(costLabel)
        rowLabel.appendChild(categoryLabel)
        rowLabel.appendChild(dateLabel)

        table.appendChild(rowLabel)

        for (let i = 0; i < 10; i++) {
            let row = document.createElement('div')
            row.style.display = 'table-row'
            row.addEventListener('mouseover', function () {
                row.style.backgroundColor = 'var(--button-color-3)'
            })
            row.addEventListener('mouseout', function () {
                row.style.backgroundColor = 'var(--button-color-2)'
            })

            let name = document.createElement('div')
            name.style.display = 'table-cell'
            name.style.backgroundColor = 'lightgray'
            name.style.padding = '0.5rem'
            name.style.color = 'black'
            name.style.textAlign = 'left'
            name.style.verticalAlign = 'middle'
            name.textContent = 'Poop'

            let cost = document.createElement('div')
            cost.style.display = 'table-cell'
            cost.style.backgroundColor = 'lightgray'
            cost.style.padding = '0.5rem'
            cost.style.color = 'black'
            cost.style.textAlign = 'left'
            cost.style.verticalAlign = 'middle'
            cost.textContent = '$ 0.10'

            let category = document.createElement('div')
            category.style.display = 'table-cell'
            category.style.backgroundColor = 'lightgray'
            category.style.padding = '0.5rem'
            category.style.color = 'black'
            category.style.textAlign = 'left'
            category.style.verticalAlign = 'middle'
            category.textContent = 'Gas'

            let date = document.createElement('div')
            date.style.display = 'table-cell'
            date.style.backgroundColor = 'lightgray'
            date.style.padding = '0.5rem'
            date.style.color = 'black'
            date.style.textAlign = 'left'
            date.style.verticalAlign = 'middle'
            date.textContent = '9/26/2018'

            row.appendChild(name)
            row.appendChild(cost)
            row.appendChild(category)
            row.appendChild(date)

            table.appendChild(row)
        }

        element.appendChild(table)

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
        let data = `req:get-budget|user:${app.user.name}|ticket:${app.user.ticket}|`
        Network.Request(data, call)
    }
    static MakeInputElement() {

        let element = document.createElement('div')
        element.style.display = 'flex'
        element.style.marginBottom = '1rem'

        let add = document.createElement('button')
        add.textContent = 'Add'
        add.onclick = function () {
            console.log('add')
        }
        add.style.minWidth = '6rem'
        add.style.border = '1px solid var(--button-color-2)'
        add.style.backgroundColor = 'var(--button-color-2)'
        add.style.outline = 'none'
        add.style.borderRadius = '0.2rem'
        add.style.padding = '0.3rem 0.3rem'
        add.style.fontWeight = 'bold'
        add.style.color = 'white'
        add.style.fontFamily = 'roboto'
        add.addEventListener('mouseover', function () {
            add.style.cursor = 'pointer'
            add.style.borderColor = 'var(--button-color-3)'
            add.style.backgroundColor = 'var(--button-color-3)'
        })
        add.addEventListener('mouseout', function () {
            add.style.cursor = 'default'
            add.style.borderColor = 'var(--button-color-2)'
            add.style.backgroundColor = 'var(--button-color-2)'
        })

        let container = document.createElement('div')
        container.style.flex = '1'
        container.style.marginRight = '1rem'

        let table = document.createElement('div')
        table.style.display = 'table'
        table.style.width = '100%'
        table.style.height = '100%'

        let row = document.createElement('div')
        row.style.display = 'table-row'

        let name = document.createElement('input')
        name.style.display = 'table-cell'
        name.style.backgroundColor = 'lightgray'
        name.style.padding = '0.5rem'
        name.style.color = 'black'
        name.style.textAlign = 'left'
        name.style.verticalAlign = 'middle'
        name.style.border = 'none'
        name.style.borderTopLeftRadius = '0.4rem'
        name.style.borderBottomLeftRadius = '0.4rem'
        name.style.fontFamily = 'roboto'
        name.style.fontWeight = 'bold'
        name.setAttribute('type', 'text')
        name.setAttribute('placeholder', 'Name')

        let cost = document.createElement('input')
        cost.style.display = 'table-cell'
        cost.style.backgroundColor = 'lightgray'
        cost.style.padding = '0.5rem'
        cost.style.color = 'black'
        cost.style.textAlign = 'left'
        cost.style.verticalAlign = 'middle'
        cost.style.border = 'none'
        cost.style.fontFamily = 'roboto'
        cost.style.fontWeight = 'bold'
        cost.setAttribute('type', 'text')
        cost.setAttribute('placeholder', 'Cost')

        let category = document.createElement('input')
        category.style.display = 'table-cell'
        category.style.backgroundColor = 'lightgray'
        category.style.padding = '0.5rem'
        category.style.color = 'black'
        category.style.textAlign = 'left'
        category.style.verticalAlign = 'middle'
        category.style.border = 'none'
        category.style.fontFamily = 'roboto'
        category.style.fontWeight = 'bold'
        category.setAttribute('type', 'text')
        category.setAttribute('placeholder', 'Category')

        let date = document.createElement('input')
        date.style.display = 'table-cell'
        date.style.backgroundColor = 'lightgray'
        date.style.padding = '0.5rem'
        date.style.color = 'black'
        date.style.textAlign = 'left'
        date.style.verticalAlign = 'middle'
        date.style.border = 'none'
        date.style.borderTopRightRadius = '0.4rem'
        date.style.borderBottomRightRadius = '0.4rem'
        date.style.fontFamily = 'roboto'
        date.style.fontWeight = 'bold'
        date.setAttribute('type', 'text')
        date.setAttribute('placeholder', 'Date')

        row.appendChild(name)
        row.appendChild(cost)
        row.appendChild(category)
        row.appendChild(date)

        table.appendChild(row)
        container.appendChild(table)

        element.appendChild(container)
        element.appendChild(add)

        return element
    }
}

class BudgetItem extends Field {

}