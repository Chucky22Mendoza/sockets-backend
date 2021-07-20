const express = require('express');
const http = require('http');
const morgan = require('morgan');
const cors = require("cors");
const socketIO = require('socket.io');
const {application} = require("./config/properties");

const app = express();
const server = http.Server(app);
const io = socketIO(server, {
    cors: {
        origin: '*'
    }
});

//VARIABLES DE ENTORNO
require("dotenv").config();

//middlewares
app.use(morgan('dev'));
app.use(cors(
    application.cors.server
));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

// welcome
app.get("/app", (req, res) => {
    res.send("Welcome to yimi platform");
});

// settings
app.set("port", process.env.PORT || 6000);

// sockets
require('./sockets')(io);

// starting the server
server.listen(app.get('port'), () => {
    console.log(`server on port ${app.get('port')}`);
});