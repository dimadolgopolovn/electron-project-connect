import { Chat, Message } from 'whatsapp-web.js';
import {
  LastMessageEntity,
  UnifiedObjectId,
} from '../../common/entities/dialog_entities';
import { DialogEntity } from '../../common/entities/dialog_list_entities';

export class WhatsAppConverters {
  static toLastMessageEntity(
    waLastMessage: Message,
    chatId: UnifiedObjectId,
  ): LastMessageEntity {
    return {
      messengerId: 'whatsapp',
      id: waLastMessage.id.id,
      date: waLastMessage.timestamp,
      messageText: waLastMessage.body,
      views: 0,
      dialogId: chatId,
      postAuthor: waLastMessage.from,
      media: undefined, // TODO: implement this
    };
  }

  static toDialogEntity(chat: Chat): DialogEntity {
    const chatId = chat.id.user;
    const waLastMessage = chat.lastMessage;
    let lastMessage: LastMessageEntity | undefined;
    if (waLastMessage) {
      lastMessage = WhatsAppConverters.toLastMessageEntity(
        waLastMessage,
        chatId,
      );
    }
    return <DialogEntity>{
      id: chatId,
      nativeChatObject: chat,
      messengerId: 'whatsapp',
      pinned: chat.pinned,
      archived: chat.archived,
      date: chat.timestamp,
      title: chat.name,
      unreadCount: chat.unreadCount,
      isUser: true,
      isGroup: false,
      isChannel: false,
      message: lastMessage,
      photoUrl: new Promise(async (resolve) => {
        const contact = await chat.getContact();
        try {
          const photoUrl = await contact.getProfilePicUrl();
          resolve(photoUrl);
        } catch (error) {
          resolve('');
        }
      }),
    };
  }
}
