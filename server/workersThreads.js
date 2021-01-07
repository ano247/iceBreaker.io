const { parentPort } = require('worker_threads');

activeUsers = {}

parentPort.on('message', ([event, ...args]) => {
    switch (event) {
        case 'join':
            const [clientId, socket] = args
            activeUsers[clientId] = {
                socket: socket,
                matchList: activeUsers[clientId]['matchList'] || []
            }
            runMatching()
            break
        case 'leave':
            activeUsers.delete(args[0])
            break
        default:
            break
    }
})

const runMatching = () => {
    // match stuff and update match list of active users
    notifyUsers();
}

const notifyUsers = () => {
    for (const [clientId, values] of activeUsers.entries()) {
        const { socket, matchList } = values
        socket.emit('match_refresh', matchList)
    }
}