import z from "zod";

// Enum to represent the supported message types
export enum SupportedMessage {
    JoinRoom = "JOIN_ROOM",
    Upvote = "UPVOTE",
    Downvote = "DOWNVOTE",
    AddSong = "ADD_SONG"
}

// Define the payload types for each message
export const InitMessageSchema = z.object({
    spaceId: z.string().min(1, "spaceId is required"),  // Ensures non-empty string
    userId: z.string().min(1, "userId is required")     // Ensures non-empty string
});

export type InitMessageType = z.infer<typeof InitMessageSchema>;

// Zod schema for UpvoteMessageType
export const UpvoteMessageSchema = z.object({
    spaceId: z.string().min(1, "spaceId is required"),  // Ensures non-empty string
    songId: z.string().min(1, "songId is required")     // Ensures non-empty string
});

export type UpvoteMessageType = z.infer<typeof UpvoteMessageSchema>;


// Zod schema for DownvoteMessageType
export const DownvoteMessageSchema = z.object({
    spaceId: z.string().min(1, "spaceId is required"),  // Ensures non-empty string
    songId: z.string().min(1, "songId is required")     // Ensures non-empty string
});

export type DownvoteMessageType = z.infer<typeof DownvoteMessageSchema>;


// Zod schema for AddSongMessageType
export const AddSongMessageSchema = z.object({
    streamId: z.string().min(1, "streamId is required"),  // Ensures non-empty string
    title: z.string().min(1, "title is required"),        // Ensures non-empty string
    upvotes: z.number().int().nonnegative(),              // Ensures a non-negative integer for upvotes
    spaceId: z.string().min(1, "spaceId is required")     // Ensures non-empty string
});


export type AddSongMessageType = z.infer<typeof AddSongMessageSchema>;


// Union type representing possible incoming message types
export type IncomingMessage = 
    | { type: SupportedMessage.JoinRoom; payload: InitMessageType }
    | { type: SupportedMessage.Upvote; payload: UpvoteMessageType }
    | { type: SupportedMessage.Downvote; payload: DownvoteMessageType }
    | { type: SupportedMessage.AddSong; payload: AddSongMessageType };
