function get_nav() {
    let bar = document.createElement('div')
    bar.classList.add('nav')

    let title = document.createElement('div')
    title.classList.add('title')
    title.innerHTML = 'FIRE PLAN'
    
    let search = document.createElement('input')
    search.classList.add('search')
    search.setAttribute('type', 'text')
    search.setAttribute('placeholder', 'Search')

    let sign = `<div><a class="sign" onclick="sign_in()">Sign in<a/> or <a class="sign" onclick="sign_up()">Sign up<a/></div>`

    bar.appendChild(title)
    bar.appendChild(search)
    bar.innerHTML += sign

    return bar
}

function get_info() {
    let bar = document.createElement('div')
    bar.classList.add('info')

    let content = document.createElement('div')
    content.classList.add('content')
    
    let title = document.createElement('a')
    title.classList.add('infotitle')
    title.innerHTML = 'Dashboard'

    content.appendChild(title)

    bar.appendChild(content)
    return bar
}

function sign_in() {
    console.log('sign in')
}

function sign_up() {
    console.log('sign up')
}