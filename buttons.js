function make_text(root, name) {
    let div = document.createElement('div')
    div.style.cssText = 'background-color: rgb(212,236,250); padding: 0.5rem; display: inline-block'
    root.appendChild(div)

    let label = document.createElement('div')
    label.innerHTML = name
    label.style.cssText = 'color:#337ab7;'
    div.appendChild(label)

    let input = document.createElement('input')
    input.setAttribute('type', 'text')
    input.classList.add('in')
    div.appendChild(input)

    return input
}

function make_text_value(root, name, value) {
    let input = make_text(root, name)
    input.value = value
    return input
}

function make_text_html(name) {
    return `<div style="background-color: rgb(212,236,250); padding: 0.5rem; display: inline-block"><div style="color:#337ab7">${name}</div><input type="text" class="in"/></div>`
}

function make_button_html(name) {
    return `<div style="background-color: rgb(212,236,250); padding: 0.5rem; display: inline-block"><button class="do">${name}</button></div>`
}