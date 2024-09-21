"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryStore = void 0;
class InMemoryStore {
    constructor() {
        this.store = new Map();
    }
    initSpace(spaceId) {
        this.store.set(spaceId, {
            spaceId,
            streams: [],
            currentStream: null
        });
    }
    getStreams(spaceId) {
        const space = this.store.get(spaceId);
        if (!space) {
            return [];
        }
        return space.streams;
    }
    upvote(spaceId, streamId) {
        const space = this.store.get(spaceId);
        if (space) {
            const stream = space.streams.find(s => s.streamId === streamId);
            if (stream) {
                stream.upvotes += 1; // Increment upvotes
            }
            return space.streams;
        }
        return [];
    }
    downvote(spaceId, streamId) {
        const space = this.store.get(spaceId);
        if (space) {
            const stream = space.streams.find(s => s.streamId === streamId);
            if (stream && stream.upvotes > 0) {
                stream.upvotes -= 1; // Decrement upvotes, ensuring it doesn't go below 0
            }
            return space.streams;
        }
        return [];
    }
    addStreams(spaceId, streamId, title, upvotes = 0, artist) {
        if (!this.store.get(spaceId)) {
            this.initSpace(spaceId);
        }
        const space = this.store.get(spaceId);
        if (space) {
            // Add a new stream to the space
            space.streams.push({
                streamId,
                title,
                upvotes,
                artist
            });
        }
        return space === null || space === void 0 ? void 0 : space.streams;
    }
    addCurrentStream(spaceId, streamId, title, extractedId, artist) {
        const space = this.store.get(spaceId);
        if (space) {
            // Remove the stream from the streams[] array, if it exists
            space.streams = space.streams.filter(stream => stream.streamId !== streamId);
            // Add a new stream to the currentStream of the space
            space.currentStream = {
                streamId,
                title,
                extractedId,
                artist
            };
        }
        return {
            streams: space === null || space === void 0 ? void 0 : space.streams,
            currentStream: space === null || space === void 0 ? void 0 : space.currentStream,
        };
    }
}
exports.InMemoryStore = InMemoryStore;
