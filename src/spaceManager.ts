import { connection } from "websocket";
import { OutgoingMessage } from "./messages/outgoingMessages";

// room.ts
interface User {
  id:string;
  conn: connection;
}

interface Space {
    spaceId: string;
    streams: any[];
    currentSong: any;
    users: User[];
}

export class SpaceManager {
    private spaces:Map<string, Space>;
  
    constructor() {
      this.spaces=new Map<string,Space>();
    }

    addUser(userId: string, socket: connection, spaceId: string) {
      // Check if the space already exists, if not, initialize it
      if (!this.spaces.has(spaceId)) {
        this.spaces.set(spaceId, {
          spaceId,
          streams: [],
          currentSong: null,
          users: [],
        });
      }
  
      // Get the space and add the user to it
      const space = this.spaces.get(spaceId);
      if (space) {
        const user: User = { id:userId, conn:socket };
        space.users.push(user); // Add the user to the Set of users
  
        console.log(`User ${userId} added to space ${spaceId}.`);
      }
      socket.on('close', (reasonCode, description) => {
        this.removeUser(spaceId, userId);
      });
    }

    removeUser(spaceId: string, userId: string) {
      console.log("removed user");
      const users = this.spaces.get(spaceId)?.users;
        if (users) {
          users.filter(({id}) => id !== userId);
      }
    }

    getUser(spaceId: string, userId: string): User | null {
      const user = this.spaces.get(spaceId)?.users.find((({id}) => id === userId));
      return user ?? null;
    }

    broadcast(spaceId: string, userId: string, message: OutgoingMessage) {
      const user = this.getUser(spaceId, userId);
      if (!user) {
          console.error("User not found");
          return;
      }
      
      const room = this.spaces.get(spaceId);
      if (!room) {
          console.error("Rom rom not found");
          return;
      }
      
      room.users.forEach(({conn, id}) => {
          if (id === userId) {
              return;
          }
          console.log("outgoing message " + JSON.stringify(message))
          conn.sendUTF(JSON.stringify(message))
      })
   }
  
  }
  