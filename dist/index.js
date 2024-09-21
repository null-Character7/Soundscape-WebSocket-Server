"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const websocket_1 = require("websocket");
const outgoingMessages_1 = require("./messages/outgoingMessages");
const incomingMessages_1 = require("./messages/incomingMessages");
const InMemoryStore_1 = require("./store/InMemoryStore");
const spaceManager_1 = require("./spaceManager");
const spaceManager = new spaceManager_1.SpaceManager();
const store = new InMemoryStore_1.InMemoryStore();
var server = http_1.default.createServer(function (request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(8080, function () {
    console.log((new Date()) + ' Server is listening on port 8080');
});
const wsServer = new websocket_1.server({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
});
function originIsAllowed(origin) {
    // put logic here to detect whether the specified origin is allowed.
    return true;
}
wsServer.on('request', function (request) {
    if (!originIsAllowed(request.origin)) {
        // Make sure we only accept requests from an allowed origin
        request.reject();
        console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
        return;
    }
    var connection = request.accept('echo-protocol', request.origin);
    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function (message) {
        if (message.type === 'utf8') {
            try {
                messageHandler(connection, JSON.parse(message.utf8Data));
            }
            catch (e) {
            }
        }
    });
    connection.on('close', function (reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});
function messageHandler(ws, message) {
    if (message.type == incomingMessages_1.SupportedMessage.JoinRoom) {
        const payload = message.payload;
        spaceManager.addUser(payload.userId, ws, payload.spaceId);
    }
    if (message.type == incomingMessages_1.SupportedMessage.AddSong) {
        const payload = message.payload;
        let streams = store.addStreams(payload.spaceId, payload.streamId, payload.title, payload.upvotes, payload.artist);
        if (!streams) {
            console.log("stream not created");
            return;
        }
        const outgoingPayload = {
            type: outgoingMessages_1.SupportedMessage.SongAdded,
            payload: {
                streams: streams
            }
        };
        spaceManager.broadcast(payload.spaceId, payload.userId, outgoingPayload);
        console.log("Song added");
    }
    if (message.type == incomingMessages_1.SupportedMessage.PlayNext) {
        const payload = message.payload;
        let res = store.addCurrentStream(payload.spaceId, payload.streamId, payload.title, payload.upvotes, payload.artist);
        const { streams, currentStream } = res;
        if (!streams) {
            console.log("errr");
            return;
        }
        if (!currentStream) {
            console.log("errr");
            return;
        }
        const outgoingPayload = {
            type: outgoingMessages_1.SupportedMessage.PlayingNext,
            payload: {
                streams: streams,
                currentStream: currentStream
            }
        };
        spaceManager.broadcast(payload.spaceId, payload.userId, outgoingPayload);
        console.log("Next started playing");
    }
    if (message.type == incomingMessages_1.SupportedMessage.Upvote) {
        const payload = message.payload;
        const user = spaceManager.getUser(payload.spaceId, payload.userId);
        if (!user) {
            console.error("User not found in the db");
            return;
        }
        let streams = store.upvote(payload.spaceId, payload.streamId);
        const outgoingPayload = {
            type: outgoingMessages_1.SupportedMessage.UpvoteSuccess,
            payload: {
                streams: streams
            }
        };
        spaceManager.broadcast(payload.spaceId, payload.userId, outgoingPayload);
        console.log("Upvote successful");
    }
    if (message.type == incomingMessages_1.SupportedMessage.Downvote) {
        const payload = message.payload;
        const user = spaceManager.getUser(payload.spaceId, payload.userId);
        if (!user) {
            console.error("User not found in the db");
            return;
        }
        let streams = store.downvote(payload.spaceId, payload.streamId);
        const outgoingPayload = {
            type: outgoingMessages_1.SupportedMessage.UpvoteSuccess,
            payload: {
                streams: streams
            }
        };
        spaceManager.broadcast(payload.spaceId, payload.userId, outgoingPayload);
        console.log("Downvote successful");
    }
}
