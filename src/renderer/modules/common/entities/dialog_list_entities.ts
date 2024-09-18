import { LastMessageEntity, UnifiedObjectId } from './dialog_entities';

export interface GetDialogsRequest {
  /** Whether the dialogs should be fetched from scratch, or if they should be retrieved from cache if possible. */
  forceRefresh?: boolean;
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

export type MessengerId = string;

/**
 * Represents a dialog entity in the application.
 *
 * @interface DialogEntity
 *
 * @property {MessengerId} messengerId - The identifier for the messenger.
 * @property {UnifiedObjectId} [id] - The unified object identifier.
 * @property {any} nativeId - The native identifier for the dialog.
 * @property {Promise<string | undefined>} [photoBase64] - A promise that resolves to the base64 encoded photo string.
 * @property {Promise<string | undefined>} [photoUrl] - A promise that resolves to the URL of the photo.
 * @property {boolean} pinned - Indicates if the dialog is pinned.
 * @property {boolean} archived - Indicates if the dialog is archived.
 * @property {LastMessageEntity} [message] - The last message entity in the dialog.
 * @property {number} date - The date of the dialog.
 * @property {string} [title] - The title of the dialog.
 * @property {number} unreadCount - The count of unread messages in the dialog.
 * @property {boolean} isUser - Indicates if the dialog is with a user.
 * @property {boolean} isGroup - Indicates if the dialog is with a group.
 * @property {boolean} isChannel - Indicates if the dialog is with a channel.
 * @property {any} [nativeChatObject] - The native chat object associated with the dialog.
 */
export interface DialogEntity {
  messengerId: MessengerId;
  id?: UnifiedObjectId;
  nativeId: any;
  photoBase64?: Promise<string | undefined>;
  photoUrl?: Promise<string | undefined>;
  pinned: boolean;
  archived: boolean;
  message?: LastMessageEntity;
  date: number;
  title?: string;
  unreadCount: number;
  isUser: boolean;
  isGroup: boolean;
  isChannel: boolean;
  nativeChatObject?: any;
}
