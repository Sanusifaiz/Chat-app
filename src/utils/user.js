const users = [ ]
const emojiStrip = require('emoji-strip')
// addUser, removeUser, getUser, getUsersInRoom

const addUser = ({id, username, room}) => {
    // Clean the data
    username = emojiStrip(username.trim().toLowerCase())
    
    room = room.trim().toLowerCase()

    // Validate the data
    if (!username || !room) {
        return {
            error: 'Username and room are required'

        }
    }

    // Check for exisiting user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    // Validate username
    if (existingUser) {
        return {
            error: 'Username is in use'
        }
    }

    // Store user
    const user = {id, username, room}
    users.push(user)
    return{user}
}

const removeUser = (id) => {
    const index = users.findIndex((users) => users.id === id)

    if (index !== -1) {                     // when =-1 means no match, when its 0 or greater means there is a match
        return users.splice(index, 1)[0]        // splice is used to remove item from an array by index, "1" means we are removing one item
    }
}


const getUser = (id) => {
    return users.find((users) => users.id === id)

}

const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    return users.filter((user) => user.room === room)
}


addUser({
    id:22,
    username: 'zaynab',
    room: 'Engineering'
})

addUser({
    id:40,
    username: 'faiz',
    room: 'Engineering  '
})

addUser({
    id:40,
    username: 'zaynab',
    room: 'Programming  '
})

const User = getUser(223)
console.log(User)

const userList = getUsersInRoom('Programming')
console.log(userList)


module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}