
export enum SupportedMessage {
    AddChat =  "ADD_CHAT",
    UpvoteSuccess = "UPVOTE_SUCCESS",
    DownvoteSuccess = "DOWNVOTE_SUCCESS",
    SongAdded = "SONG_ADDED"
}

type MessagePayload = {
    creatorId: string;
    userId: string;
    streamId: string;
    upvotes: number;
}

export type OutgoingMessage = {
    type: SupportedMessage.AddChat,
    payload: Partial<MessagePayload>
} | {
    type: SupportedMessage.UpvoteSuccess,
    payload: Partial<MessagePayload>
} | {
    type: SupportedMessage.DownvoteSuccess,
    payload: Partial<MessagePayload>
} | {
    type: SupportedMessage.SongAdded,
    payload: Partial<MessagePayload>
};

