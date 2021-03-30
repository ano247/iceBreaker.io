const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const { Worker, isMainThread, parentPort } = require('worker_threads');
const mongoose = require('mongoose');
const cors = require('cors')
const routes = require('./routes')

const port = process.env.PORT || 4001;

const app = express();

app.use(cors)
app.use(express.json())

app.use(routes)

const server = http.createServer(app);

const io = socketIo(server);

const workerThreadByLocation = {}

//can use socket-io-jwt-auth instead

/*io.use((socket, next)){
    const token = socket.handshake.auth.token;
    if(isValid(token)) next();
    socket.on('error, (err) => throw new Error(err))
} */

io.on("connection", (socket) => {
    console.log("New client connected");
    socket.on('location_selected', (data) => {
        //how to get location/id from client
        const { clientId, location } = data;

        if (!location in workerThreadByLocation) {
            workerThreadByLocation[location] = createNewWorker()
        }
        //location id instead of location maybe? More unique
        const workerForUserLocation = workerThreadByLocation[location]

        workerForUserLocation.postMessage(['join', clientId, socket])

    });
})

server.listen(port, () => console.log(`Listening on port ${port}`));

const createNewWorker = () => {
    const worker = new Worker('./WorkerThreads.js')
    //define all callbacks for workers here
    //e.g. worker.on('message', console.log)
}