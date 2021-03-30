const { parentPort } = require('worker_threads');
const express = require("express");
const Users = require('./models/User');

const app = express()

activeUsers = {} //maps from userId to an object containing the socket for that user and the matchList for that user 

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

const runMatching = async (clientId) => {
    // match stuff and update match list of active users

    //get details of new user
    const newUserData = await User.findOne({ _id: clientId })
    const newUserInfo = JSON.parse(newUserData)

    //get the details of all the users in that location
    const usersInfo = []

    Object.keys(activeUsers).forEach(function (clientId) {
        const result = await User.findOne({ _id: clientId })
        const userInfo = JSON.parse(result)

        usersInfo.push(userInfo)
    })

    const score = 0
    const threshold = 5

    //  const matches = []

    usersInfo.forEach(function (user) {

        const interests = user.interests;

        interests.forEach(function (fav) {
            const currUserCorrFav = newUserInfo.fav
            for (const favNames1 of fav) {
                for (const favNames2 of currUserCorrFav) {
                    if (favNames1 == favNames2) {
                        score++;
                    }
                }
            }
        })
        if (score > threshold) {
            activeUsers[user._id][matchList].push(clientId)
        }
    })

    notifyUsers();
}

const notifyUsers = () => {
    for (const [clientId, values] of activeUsers.entries()) {
        const { socket, matchList } = values
        socket.emit('match_refresh', matchList)
    }
}