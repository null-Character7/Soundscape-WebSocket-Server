
export enum SupportedMessage {
    UpvoteSuccess = "UPVOTE_SUCCESS",
    DownvoteSuccess = "DOWNVOTE_SUCCESS",
    SongAdded = "SONG_ADDED",
    PlayingNext = "PLAYING_NEXT"
}
import { curStream, Stream } from "../store/Store";

export type MessagePayload = {
    streams: Stream[]; // Array of streams
    currentStream: curStream | null; // Current stream, can be null if no stream is playing
};

export type OutgoingMessage = {
    type: SupportedMessage.UpvoteSuccess,
    payload: Partial<MessagePayload>
} | {
    type: SupportedMessage.DownvoteSuccess,
    payload: Partial<MessagePayload>
} | {
    type: SupportedMessage.SongAdded,
    payload: Partial<MessagePayload>
} | {
    type: SupportedMessage.PlayingNext,
    payload: Partial<MessagePayload>
};

