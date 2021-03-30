const { parentPort } = require('worker_threads');
const mongoose = require('mongoose')

activeUsers = {} //maps from clientId to an object containing 

parentPort.on('message', ([event, ...args]) => {
    switch (event) {
        case 'join':
            const [clientId, socket] = args
            activeUsers[clientId] = {
                socket: socket,
                matchList: activeUsers[clientId]['matchList'] || []
            }
            runMatching(clientId)
            break
        case 'disconnect':
            activeUsers.delete(args[0])
            break
        default:
            break
    }
})

const runMatching = (clientId) => {
    // match stuff and update match list of active users

    //get details of new user
    const newInfo = {}

    //get the details of all the users in that location
    const usersInfo = []

    const score = 0
    const threshold = 5

    const matches = []

    usersInfo.forEach(function (user) {

    })

    notifyUsers();
}

const notifyUsers = () => {
    for (const [clientId, values] of activeUsers.entries()) {
        const { socket, matchList } = values
        socket.emit('match_refresh', matchList)
    }
}