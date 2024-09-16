import { Client } from 'whatsapp-web.js';
import { LastMessageEntity } from '../common/entities/dialog_entities';
import {
  DialogEntity,
  GetDialogsRequest,
} from '../common/entities/dialog_list_entities';
import { DialogsRepository } from '../common/repositories/dialogs_repository';

export class WhatsappDialogsRepository extends DialogsRepository {
  constructor({
    messengerId,
    client,
  }: {
    messengerId: string;
    client: Client;
  }) {
    super();
    this.messengerId = messengerId;
    this.client = client;
  }

  messengerId: string;
  client: Client;

  async getDialogsList(request: GetDialogsRequest): Promise<DialogEntity[]> {
    const chats = await this.client.getChats();
    return chats.map((chat) => {
      const waLastMessage = chat.lastMessage;
      let lastMessage: LastMessageEntity | undefined;
      if (waLastMessage) {
        lastMessage = {
          messengerId: this.messengerId,
          id: waLastMessage.id.id,
          date: waLastMessage.timestamp,
          messageText: waLastMessage.body,
          views: 0,
          dialogId: chat.id.user,
          postAuthor: waLastMessage.from,
        };
      }
      return <DialogEntity>{
        nativeChatObject: chat,
        messengerId: this.messengerId,
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
    });
  }

  async getBase64ImageFromURL(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      fetch(url)
        .then((response) => response.blob())
        .then((blob) => {
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = () => reject('Error reading blob');
        })
        .catch((error) => reject(error));
    });
  }

  // messageCallbackMap: Map<
  //   (event: LastMessageEntity) => void,
  //   (event: NewMessageEvent) => void
  // > = new Map();

  addNewMessageHandler(callback: (event: LastMessageEntity) => void): void {}

  removeNewMessageHandler(callback: (event: LastMessageEntity) => void): void {}
}
