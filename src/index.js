const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const {generateMessage, generateLocationMessage} = require('./utils/messages')
const {addUser, removeUser, getUser, getUsersInRoom} = require('./utils/user')


const app = express()
const server = http.createServer(app)
const io =socketio(server)


const port = process.env.PORT || 3000




// Define paths for Express config
const publicdirectoryPath = path.join(__dirname, '../public')

const Admin = 'Admin'
// server (emit) -> client (receive) = countUpdated
// client (emit) -> server (receive) = increment

io.on('connection', (socket) => {
    console.log('New WebSocket Connection')

    //socket.emit('message', generateMessage('Welcome!!!'))           //emit to particular conneection

 

    socket.emit('chat', "Welcome to my Chat-App" )  

    

    socket.on('join', ({ username, room}, callback) => {
        const {error, user} = addUser({id: socket.id, username, room})

        if (error) {
            return callback(error)
        }

        socket.join(user.room)
        
        socket.emit('message', generateMessage(Admin, 'Welcome!!!')) 
        socket.broadcast.to(user.room).emit('message', generateMessage(Admin, `${user.username} has joined the room`))     //emit to everyone except the sender
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })


         callback()
        // socket.emit, io.emit, socket.broadcast.emit
        // io.to.emit - emmits message to everyone in a room
        // socket.broadcast.to.emit - sends message to everyone except the sender in a specific room
        
       
    
    
    })

    socket.on('sendchat', (chat, callback) => {
        const user = getUser(socket.id)
        
        const filter = new Filter()

        if(filter.isProfane(chat)) {
           // return filter.clean(chat)
            return callback('Profanity is not allowed')
        }
        
        
        io.to(user.room).emit('message', generateMessage(user.username, chat))    // to send to everyone
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if(user) {
             io.to(user.room).emit('message', generateMessage(Admin, `${user.username} has left!`))  
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
            }
       
    })

    socket.on('location', (coord, callback) => {

        const user = getUser(socket.id)
        io.to(user.room).emit('location', generateLocationMessage(user.username,`https://google.com/maps?q=${coord.latitude},${coord.longitude}`))
        
        //io.emit('message', 'Location:, '+', coords.latitude, '+', coords.longitude')
        callback()

    })

    //socket.emit('location', "locationDetails")

//     socket.on('increment', () => {
//         count++
//      //   socket.emit('countUpdated', count)
//         io.emit('countUpdated', count)
//     }) 
 })


// Setup static directory to serve
app.use(express.static(publicdirectoryPath))

server.listen(port, () => {
    console.log('Server is up on port ' + port)
})  

 