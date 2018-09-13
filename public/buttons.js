class Field {
    constructor(root, name, value) {
        this.div = document.createElement('div')
        this.div.classList.add('in-div')
        root.appendChild(this.div)
    
        this.label = document.createElement('div')
        this.label.innerHTML = name
        this.label.classList.add('in-label')
        this.div.appendChild(this.label)
    
        this.input = document.createElement('input')
        this.input.setAttribute('type', 'text')
        this.input.classList.add('in')
        this.div.appendChild(this.input)
    
        this.input.value = value

        this.color = 'black'
        this.invalid_color = 'red'
    }
    invalid() {
        if (this.input.value === '') {
            this.label.style.color = this.invalid_color
            return true
        } else {
            this.label.style.color = this.color
            return false
        }
    }
}

class OptionalField extends Field {
    invalid() {
    
    }
}