import {
  DialogEntity,
  DialogsRepository,
  GetDialogsRequest,
  LastMessageEntity,
} from 'chat-module';
import { Client } from 'whatsapp-web-electron.js';

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
    return [];
  }

  // messageCallbackMap: Map<
  //   (event: LastMessageEntity) => void,
  //   (event: NewMessageEvent) => void
  // > = new Map();

  addNewMessageHandler(callback: (event: LastMessageEntity) => void): void {}

  removeNewMessageHandler(callback: (event: LastMessageEntity) => void): void {}
}
