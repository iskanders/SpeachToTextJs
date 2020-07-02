const http = require("http");
const keys = require("./keys")
const port = keys.PORT || 4000
const config = require("./config");
const speechToText = require("./ibmApiConnection");
const WebSocketServer = require('websocket').server;

const server = http.createServer(config);
server.listen(port);
// create the server
const wsServer = new WebSocketServer({
    httpServer: server
});

// WebSocket server
wsServer.on('request', function(request) {
    const connection = request.accept(null, request.origin);
    // This is the most important callback for us, we'll handle
    // all messages from users here.
    connection.on('message', function(message) {
        speechToText(message, (event)=>{
               connection.send(JSON.stringify(event,null,2));
        })
    });
    connection.on('close', function(connection) {

    });
});
