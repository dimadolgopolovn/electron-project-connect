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
