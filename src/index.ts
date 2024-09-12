import http from 'http';
import {server as WebSocketServer, connection} from "websocket"
import { OutgoingMessage, SupportedMessage as OutgoingSupportedMessages } from './messages/outgoingMessages';
import { IncomingMessage, SupportedMessage } from './messages/incomingMessages';
import { InMemoryStore } from './store/InMemoryStore';
import { SpaceManager } from './spaceManager';
const spaceManager = new SpaceManager();
const store=new InMemoryStore();

var server = http.createServer(function(request: any, response: any) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});

server.listen(8080, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
});

 const wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
});

function originIsAllowed(origin: string) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }
    
    var connection = request.accept('echo-protocol', request.origin);
    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            try {
                messageHandler(connection, JSON.parse(message.utf8Data));
            } catch(e) {

            }
        }
    });
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});

function messageHandler(ws: connection, message: any) {
    if(message.type == SupportedMessage.JoinRoom){
        const payload=message.payload;
        spaceManager.addUser(payload.userId,ws,payload.spaceId);
    }

    if(message.type==SupportedMessage.AddSong){
        const payload=message.payload;
        let streams=store.addStreams(payload.spaceId,payload.streamId,payload.title,payload.upvotes);
        if(!streams){
            console.log("stream not created")
            return;
        }
        const outgoingPayload: OutgoingMessage={
            type:OutgoingSupportedMessages.SongAdded,
            payload: {
                streams:streams
            }
        }
        spaceManager.broadcast(payload.spaceId,payload.userId,outgoingPayload);
        console.log("Song added")
    }

    if(message.type==SupportedMessage.Upvote){
        const payload=message.payload;
        const user=spaceManager.getUser(payload.spaceId,payload.userId);

        if(!user){
            console.error("User not found in the db");
            return;
        }
        let streams=store.upvote(payload.spaceId,payload.streamId);
        const outgoingPayload: OutgoingMessage={
            type:OutgoingSupportedMessages.UpvoteSuccess,
            payload: {
                streams:streams
            }
        }
        spaceManager.broadcast(payload.spaceId,payload.userId,outgoingPayload);
        console.log("Upvote successful");
    }

    if(message.type==SupportedMessage.Downvote){
        const payload=message.payload;
        const user=spaceManager.getUser(payload.spaceId,payload.userId);

        if(!user){
            console.error("User not found in the db");
            return;
        }
        let streams=store.downvote(payload.spaceId,payload.streamId);
        const outgoingPayload: OutgoingMessage={
            type:OutgoingSupportedMessages.UpvoteSuccess,
            payload: {
                streams:streams
            }
        }
        spaceManager.broadcast(payload.spaceId,payload.userId,outgoingPayload);
        console.log("Downvote successful");
    }
}