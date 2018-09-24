class Element {
    constructor(type) {
        this.ref = document.createElement(type)
    }
}

class Field {
    constructor(root, form, name, label_name, value) {

        form[name] = this
        this.name = name

        this.div = document.createElement('div')
        this.div.classList.add('in-div')
        root.appendChild(this.div)

        this.label = document.createElement('div')
        this.label.textContent = label_name
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

class PasswordField extends Field {
    constructor(root, form, name, label_name, value) {
        super(root, form, name, label_name, value)
        this.input.setAttribute('type', 'password')
    }
}

class OptionalField extends Field {
    invalid() {

    }
}

class Button {
    constructor(name, call) {
        let element = document.createElement('button')
        /* element.style.marginTop = 'var(--space)'
        element.style.minWidth = '10rem'
        element.style.backgroundColor = 'var(--button-color-2)'
        element.style.border = 'none'
        element.style.outline = 'none'
        element.style.borderRadius = '0.2rem'
        element.style.padding = '0.6rem 0.6rem'
        element.style.fontWeight = 'bold'
        element.style.color = 'white'
        element.style.fontFamily = 'roboto'
        element.addEventListener('mouseover', function () {
            element.style.cursor = 'pointer'
            element.style.backgroundColor = 'var(--button-color-3)'
        })
        element.addEventListener('mouseout', function () {
            element.style.cursor = 'default'
            element.style.backgroundColor = 'var(--button-color-2)'
        }) */

        let style = document.createElement('style')
        document.head.appendChild(style)
        style.sheet.insertRule(`.calcbt {
            margin-top: var(--space);
            min-width: 10rem;
            background-color: var(--button-color-2);
            border: none;
            outline: none;
            border-radius: 0.2rem;
            padding: 0.6rem 0.6rem;
            font-weight: bold;
            color: white;
            font-family: 'roboto'; }`)
        style.sheet.insertRule(`.calcbt:hover {
            cursor: pointer;
            background-color: var(--button-color-3); }`)

        element.classList.add('calcbt')

        element.textContent = name
        element.onclick = call
        this.element = element
    }
}