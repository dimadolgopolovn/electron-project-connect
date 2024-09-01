export interface GetDialogsRequest {
  /**  How many dialogs to be retrieved as maximum. Can be set to undefined to retrieve all dialogs.<br/>
   * Note that this may take whole minutes if you have hundreds of dialogs, as Telegram will tell the library to slow down through a FloodWaitError.*/
  limit?: number;
  /** The offset date of last message of dialog to be used. */
  offsetDate?: number;
  /** The message ID to be used as offset. */
  offsetId?: number;
  /** Whether pinned dialogs should be ignored or not. When set to true, these won't be yielded at all. */
  ignorePinned?: boolean;
  /** The folder from which the dialogs should be retrieved.<br/>
   * If left unspecified, all dialogs (including those from folders) will be returned.<br/>
   * If set to 0, all dialogs that don't belong to any folder will be returned.<br/>
   * If set to a folder number like 1, only those from said folder will be returned.<br/>
   * By default Telegram assigns the folder ID 1 to archived chats, so you should use that if you need to fetch the archived dialogs.<br/> */
  folder?: number;
  /**  Alias for folder. If unspecified, all will be returned, false implies `folder:0` and True implies `folder:1`.*/
  archived?: boolean;
}

export interface DialogEntity {
  pinned: boolean;
  archived: boolean;
  message?: MessageEntity;
  date: number;
  id?: bigInt.BigInteger;
  name?: string;
  title?: string;
  unreadCount: number;
  unreadMentionsCount: number;
  isUser: boolean;
  isGroup: boolean;
  isChannel: boolean;
}

export interface UserId {
  userId: BigInteger;
}

export type TypeMessageMediaEntity =
  | MessageMediaPhotoEntity
  | MessageMediaUnsupportedEntity;

export interface MessageMediaPhotoEntity {
  spoiler?: boolean | undefined;
  url: string;
}

export interface MessageMediaUnsupportedEntity {}

export interface MessageEntity {
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
  fromId?: UserId;
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
   * The date when this message was last edited.
   */
  editDate?: number;
  /**
   * The display name of the message sender to show in messages sent to broadcast channels.
   */
  postAuthor?: string;
  /**
   *  If this message belongs to a group of messages (photo albums or video albums),
   *  all of them will have the same value here.
   */
  groupedId?: BigInteger;
  /**
   * The Time To Live period configured for this message.
   * The message should be erased from wherever it's stored (memory, a
   * local database, etc.) when this threshold is met.
   */
  ttlPeriod?: number;
}
