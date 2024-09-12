"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpaceManager = void 0;
class SpaceManager {
    constructor() {
        this.spaces = new Map();
    }
    addUser(userId, socket, spaceId) {
        // Check if the space already exists, if not, initialize it
        if (!this.spaces.has(spaceId)) {
            this.spaces.set(spaceId, {
                spaceId,
                streams: [],
                currentSong: null,
                users: [],
            });
        }
        console.log(this.spaces.get(spaceId));
        // Get the space and add the user to it
        const space = this.spaces.get(spaceId);
        if (space) {
            const user = { id: userId, conn: socket };
            space.users.push(user); // Add the user to the Set of users
            console.log(`User ${userId} added to space ${spaceId}.`);
        }
        socket.on('close', (reasonCode, description) => {
            this.removeUser(spaceId, userId);
        });
    }
    removeUser(spaceId, userId) {
        var _a;
        console.log("removed user");
        const users = (_a = this.spaces.get(spaceId)) === null || _a === void 0 ? void 0 : _a.users;
        if (users) {
            users.filter(({ id }) => id !== userId);
        }
    }
    getUser(spaceId, userId) {
        var _a;
        const user = (_a = this.spaces.get(spaceId)) === null || _a === void 0 ? void 0 : _a.users.find((({ id }) => id === userId));
        return user !== null && user !== void 0 ? user : null;
    }
    broadcast(spaceId, userId, message) {
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
        room.users.forEach(({ conn, id }) => {
            if (id === userId) {
                return;
            }
            console.log("outgoing message " + JSON.stringify(message));
            conn.sendUTF(JSON.stringify(message));
        });
    }
}
exports.SpaceManager = SpaceManager;
