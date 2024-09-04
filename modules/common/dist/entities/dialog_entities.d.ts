import { MessengerId } from './dialog_list_entities';
export type UnifiedObjectId = string;
export type TypeMessageMediaEntity = MessageMediaPhotoEntity | MessageMediaUnsupportedEntity;
export interface MessageMediaPhotoEntity {
    spoiler?: boolean | undefined;
    url: string;
}
export interface MessageMediaUnsupportedEntity {
}
export interface LastMessageEntity {
    messengerId: MessengerId;
    /**
     * Whether the message is outgoing (i.e. you sent it from
     * another session) or incoming (i.e. someone else sent it).
     * <br/>
     * Note that messages in your own chat are always incoming,
     * but this member will be `true` if you send a message
     * to your own chat. Messages you forward to your chat are
     * **not** considered outgoing, just like official clients
     * display them.
     */
    out?: boolean;
    /**
     * The ID of this message. This field is *always* present.
     * Any other member is optional and may be `undefined`.
     */
    id: number;
    /**
     * The peer who sent this message, which is either
     * {@link Api.PeerUser}, {@link Api.PeerChat} or {@link Api.PeerChannel}.
     * This value will be `undefined` for anonymous messages.
     */
    fromId?: UnifiedObjectId;
    /**
     * The timestamp indicating when this message was sent.
     * This will always be present except for empty messages.
     */
    date: number;
    /**
     * The string text of the message for {@link Api.Message} instances,
     * which will be `undefined` for other types of messages.
     */
    messageText: string;
    /**
     * The media sent with this message if any (such as photos, videos, documents, gifs, stickers, etc.).
     *
     * You may want to access the `photo`, `document` etc. properties instead.
     *
     * If the media was not present or it was {@link Api.MessageMediaEmpty},
     * this member will instead be `undefined` for convenience.
     */
    media?: TypeMessageMediaEntity;
    /**
     *  The number of views this message from a broadcast channel has.
     *  This is also present in forwards.
     */
    views?: number;
    /**
     * The display name of the message sender to show in messages sent to broadcast channels.
     */
    postAuthor?: string;
}
