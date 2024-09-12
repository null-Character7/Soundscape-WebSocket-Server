import { Store, Stream } from "./Store";

export interface Space {
    spaceId: string;
    streams: Stream[];
}

export class InMemoryStore implements Store {
    private store: Map<string, Space>;

    constructor() {
        this.store = new Map<string, Space>();
    }

    initSpace(spaceId: string): void {
        this.store.set(spaceId, {
            spaceId,
            streams: []
        });
    }

    getStreams(spaceId: string): Stream[] {
        const space = this.store.get(spaceId);
        if (!space) {
            return [];
        }
        return space.streams;
    }

    upvote(spaceId: string, streamId: string) {
        const space = this.store.get(spaceId);
        if (space) {
            const stream = space.streams.find(s => s.streamId === streamId);
            if (stream) {
                stream.upvotes += 1;  // Increment upvotes
            }
            return space.streams;
        }
        return [];
        
    }

    downvote(spaceId: string, streamId: string) {
        const space = this.store.get(spaceId);
        if (space) {
            const stream = space.streams.find(s => s.streamId === streamId);
            if (stream && stream.upvotes > 0) {
                stream.upvotes -= 1;  // Decrement upvotes, ensuring it doesn't go below 0
            }
            return space.streams;
        }
        return [];
        
    }

    addStreams(spaceId: string, streamId: string, title: string, upvotes: number = 0){
        const space = this.store.get(spaceId);
        if (space) {
            // Add a new stream to the space
            space.streams.push({
                streamId,
                title,
                upvotes
            });
        }
        return space?.streams;
    }
}
