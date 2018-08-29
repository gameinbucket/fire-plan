function make_text(root, name) {
    let div = document.createElement('div')
    div.classList.add('in-div')
    root.appendChild(div)

    let label = document.createElement('div')
    label.innerHTML = name
    label.classList.add('in-label')
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