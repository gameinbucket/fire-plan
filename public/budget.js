class Budget {
    constructor(app) {
        let self = this
        this.name = 'Budget'
        this.link = 'budget'

        let element = document.createElement('div')
        this.element = element
        element.classList.add('content')

        let group = document.createElement('div')
        group.classList.add('input-group')

        let form = new Map()
        this.form = form

        for (let i = 0; i < 10; i++) {
            new BudgetItem(group, form, '#' + i, '#' + 1, '')
        }

        element.appendChild(group)

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
}

class BudgetItem extends Field {

}