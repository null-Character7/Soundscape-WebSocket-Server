
export enum SupportedMessage {
    UpvoteSuccess = "UPVOTE_SUCCESS",
    DownvoteSuccess = "DOWNVOTE_SUCCESS",
    SongAdded = "SONG_ADDED"
}
import { Stream } from "../store/Store";

export type MessagePayload = {
    streams: Stream[]; // Include an array of streams in the payload
};

export type OutgoingMessage = {
    type: SupportedMessage.UpvoteSuccess,
    payload: MessagePayload
} | {
    type: SupportedMessage.DownvoteSuccess,
    payload: MessagePayload
} | {
    type: SupportedMessage.SongAdded,
    payload: MessagePayload
};

