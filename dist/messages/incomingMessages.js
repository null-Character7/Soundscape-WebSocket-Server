"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayNextSchema = exports.AddSongMessageSchema = exports.DownvoteMessageSchema = exports.UpvoteMessageSchema = exports.InitMessageSchema = exports.SupportedMessage = void 0;
const zod_1 = __importDefault(require("zod"));
// Enum to represent the supported message types
var SupportedMessage;
(function (SupportedMessage) {
    SupportedMessage["JoinRoom"] = "JOIN_ROOM";
    SupportedMessage["Upvote"] = "UPVOTE";
    SupportedMessage["Downvote"] = "DOWNVOTE";
    SupportedMessage["AddSong"] = "ADD_SONG";
    SupportedMessage["PlayNext"] = "PLAY_NEXT";
})(SupportedMessage || (exports.SupportedMessage = SupportedMessage = {}));
// Define the payload types for each message
exports.InitMessageSchema = zod_1.default.object({
    spaceId: zod_1.default.string().min(1, "spaceId is required"), // Ensures non-empty string
    userId: zod_1.default.string().min(1, "userId is required") // Ensures non-empty string
});
// Zod schema for UpvoteMessageType
exports.UpvoteMessageSchema = zod_1.default.object({
    spaceId: zod_1.default.string().min(1, "spaceId is required"), // Ensures non-empty string
    streamId: zod_1.default.string().min(1, "songId is required"), // Ensures non-empty string
    userId: zod_1.default.string().min(1, "userId is required") // Ensures non-empty string
});
// Zod schema for DownvoteMessageType
exports.DownvoteMessageSchema = zod_1.default.object({
    spaceId: zod_1.default.string().min(1, "spaceId is required"), // Ensures non-empty string
    streamId: zod_1.default.string().min(1, "songId is required"), // Ensures non-empty string
    userId: zod_1.default.string().min(1, "userId is required") // Ensures non-empty string
});
// Zod schema for AddSongMessageType
exports.AddSongMessageSchema = zod_1.default.object({
    streamId: zod_1.default.string().min(1, "streamId is required"), // Ensures non-empty string
    title: zod_1.default.string().min(1, "title is required"), // Ensures non-empty string
    upvotes: zod_1.default.number().int().nonnegative(), // Ensures a non-negative integer for upvotes
    spaceId: zod_1.default.string().min(1, "spaceId is required"), // Ensures non-empty string
    userId: zod_1.default.string().min(1, "userId is required") // Ensures non-empty string
});
// Zod schema for PlayNextType
exports.PlayNextSchema = zod_1.default.object({
    streamId: zod_1.default.string().min(1, "streamId is required"), // Ensures non-empty string
    title: zod_1.default.string().min(1, "title is required"), // Ensures non-empty string
    upvotes: zod_1.default.number().int().nonnegative(), // Ensures a non-negative integer for upvotes
    spaceId: zod_1.default.string().min(1, "spaceId is required"), // Ensures non-empty string
    userId: zod_1.default.string().min(1, "userId is required") // Ensures non-empty string
});
