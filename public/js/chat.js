const socket = io()
//const message = document.querySelector('input')


// Elements
const $messageform = document.querySelector('#message-form')
const $location = document.querySelector('#send-location')
const $messageformInput = $messageform.querySelector('input')
const $messageformButton = $messageform.querySelector('button')
const $messages = document.querySelector('#messages')
const $locationurl = document.querySelector('#messages')

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-Template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML
//Options
const { username, room} = Qs.parse(location.search, { ignoreQueryPrefix: true})

const autoscroll = () => {
    // New message element 
    const $newMessage = $messages.lastElementChild

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
        const newMessageHeight = $newMessage.offsetHeight + newMessageMargin


    // visible height
    const visibleHeight = $messages.offsetHeight

    // Height of messages container
    const containerHeight = $messages.scrollHeight

    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if(containerHeight - newMessageHeight <= scrollOffset ) {
        $messages.scrollTop = $messages.scrollHeight
    }
}


socket.on('message', (message, username) => {
    console.log(message)
    const link = Mustache.render(messageTemplate, {
        message: message.text,
        createdAt: moment(message.createdAt).format('H:mm a'),
        username: message.username
    })
    $messages.insertAdjacentHTML('beforeend', link)
    autoscroll()
})

socket.on('chat', (chat) => {
    console.log(chat)
    
})

socket.on('location', (message, username) => {
    console.log(message)
    const html = Mustache.render(locationTemplate, {
        username: message.username,
        url:message.url,
        createdAt:moment(message.createdAt).format('H:mm a'), 

    })
    $locationurl.insertAdjacentHTML('beforeend', html)
})

socket.on('roomData', ({room, users}) => {
   const html = Mustache.render(sidebarTemplate, {
        room,
        users
   })
   document.querySelector('#sidebar').innerHTML = html
})

$messageform.addEventListener('submit', (e) => {
    e.preventDefault()
    
    $messageformButton.setAttribute('disabled', 'disabled')
    
    // disable
    const message = e.target.elements.chat.value

    socket.emit('sendchat', message, (error) => {
        $messageformButton.removeAttribute('disabled')
        $messageformInput.value = ''
        $messageformInput.focus()

        if (error) {
            return console.log(error)
        }
        console.log('Message Delivered!')
    })
    })
// document.querySelector('#sendMessage').addEventListener('click', () => {
//     console.log('clicked')
//     socket.emit('increment')
// })

$location.addEventListener('click', () => {
    
    $location.setAttribute('disabled', 'disabled')  //button disable
    
    
    if (!navigator.geolocation) {
        return alert('Geolocation is not supoorted by your browser.')
    }
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('location', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            
            $location.removeAttribute('disabled')
            console.log('Location sent!')
        })
       // console.log(position)
    })


})

socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href='/'
    }
})