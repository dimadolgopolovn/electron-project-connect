import { Client, Message } from 'whatsapp-web.js';
import { LastMessageEntity } from '../common/entities/dialog_entities';
import {
  DialogEntity,
  GetDialogsRequest,
} from '../common/entities/dialog_list_entities';
import { DialogsRepository } from '../common/repositories/dialogs_repository';
import { WhatsAppConverters } from './utils/whatsapp_converters';

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
    return chats.map(WhatsAppConverters.toDialogEntity);
  }

  messageCallbackMap: Map<
    (event: LastMessageEntity) => void,
    (event: Message) => void
  > = new Map();

  addNewMessageHandler(callback: (event: LastMessageEntity) => void): void {
    const waCallback = async (message: Message) => {
      const chat = await message.getChat();
      const muted = (chat.isMuted || chat.archived) ?? false;
      const lastMessage = WhatsAppConverters.toLastMessageEntity(
        message,
        chat.id.user,
        muted,
      );
      callback(lastMessage);
    };
    this.messageCallbackMap.set(callback, waCallback);
    this.client.on('message', waCallback);
  }

  removeNewMessageHandler(callback: (event: LastMessageEntity) => void): void {
    const waCallback = this.messageCallbackMap.get(callback);
    if (waCallback) {
      this.client.off('message', waCallback);
      this.messageCallbackMap.delete(callback);
    }
  }
}
