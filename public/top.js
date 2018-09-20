function get_nav() {
    let bar = document.createElement('div')
    bar.classList.add('nav')

    let title = document.createElement('div')
    title.classList.add('title')
    title.innerHTML = 'Fire'
    title.onclick = switch_dashboard
    
    let search = document.createElement('input')
    search.classList.add('search')
    search.setAttribute('type', 'text')
    search.setAttribute('placeholder', 'Search')

    let sign = user.ticket === '' ? not_signed_in() : is_signed_in()

    search.classList.add('search')
    search.setAttribute('type', 'text')
    search.setAttribute('placeholder', 'Search')

    bar.appendChild(title)
    bar.appendChild(search)
    bar.appendChild(sign)

    return bar
}

function not_signed_in() {
    let sign = document.createElement('div')
    let sign_in = document.createElement('a')
    sign_in.classList.add('sign')
    sign_in.innerHTML = 'Sign in'
    sign_in.onclick = request_sign_in
    let sign_up = document.createElement('a')
    sign_up.classList.add('sign')
    sign_up.innerHTML = 'Sign up'
    sign_up.onclick = request_sign_up
    let or = document.createElement('span')
    or.innerHTML = ' or '
    sign.appendChild(sign_in)
    sign.appendChild(or)
    sign.appendChild(sign_up)

    return sign
}

function is_signed_in() {
    let sign = document.createElement('div')
    let sign_out = document.createElement('a')
    sign_out.classList.add('sign')
    sign_out.innerHTML = 'Sign out'
    sign_out.onclick = request_sign_out
    sign.appendChild(sign_out)

    return sign
}

function get_info() {
    let bar = document.createElement('div')
    bar.classList.add('info')

    let content = document.createElement('div')
    content.classList.add('content')
    
    let title = document.createElement('a')
    title.classList.add('infotitle')
    title.innerHTML = active_page.name
    title_label = title

    content.appendChild(title)
    bar.appendChild(content)

    return bar
}

function request_sign_in() {
    let call = function(data) {
        let store = Pack.Parse(data)
        if (store['error']) {
            console.log('error ' + store['error'])
            return
        }
        if (store['ticket']) {
            user.ticket = store['ticket']
            localStorage.setItem('ticket', user.ticket)
        }
    }
    let password = `abcdf`
    let data = `req:sign-in|user:${user.name}|password:${password}|`
    Network.Request(data, call)
}

function request_sign_up() {
    let call = function(data) {
        let store = Pack.Parse(data)
        if (store['error']) {
            console.log('error ' + store['error'])
            return
        }
        if (store['ticket']) {
            user.ticket = store['ticket']
            localStorage.setItem('ticket', user.ticket)
        }
    }
    let password = `abcdf`
    let data = `req:sign-up|user:${user.name}|password:${password}|`
    Network.Request(data, call)
}

function request_sign_out() {
    let call = function(data) {
        let store = Pack.Parse(data)
        if (store['error']) {
            console.log('error ' + store['error'])
            return
        }
    }
    let data = `req:sign-out|user:${user.name}|ticket:${user.ticket}|`
    Network.Request(data, call)
}