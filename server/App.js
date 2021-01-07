const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const { Worker, isMainThread, parentPort } = require('worker_threads');

const port = process.env.PORT || 4001;
const index = require("./routes/index");

const app = express();

app.use(index);
//write code to get user info into db beforehand. Registering?
const server = http.createServer(app);

const io = socketIo(server);

const workerThreadByLocation = {}


io.on("connection", (socket) => {
    console.log("New client connected");
    socket.on('location_selected', (data) => {
        //how to get location/id from client
        const { clientId, location } = data;

        if (!location in workerThreadByLocation) {
            workerThreadByLocation[location] = createNewWorker()
        }

        const workerForUserLocation = workerThreadByLocation[location]

        workerForUserLocation.postMessage(['join', clientId, socket])

        socket.on("disconnect", () => {
            console.log("Client disconnected");
        });
    });

})

server.listen(port, () => console.log(`Listening on port ${port}`));

const createNewWorker = () => {
    const worker = new Worker('./WorkerThreads.js')


    //define all callbacks for workers here
    // e.g. worker.on('message', console.log)
}