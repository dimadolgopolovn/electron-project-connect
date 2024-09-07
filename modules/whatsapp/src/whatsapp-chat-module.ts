import { ChatModule, Completer, DialogsRepository } from 'chat-module';
import { Client } from 'whatsapp-web.js';
import { WhatsappDialogsRepository } from './repositories/whatsapp_dialogs_repository';

export class WhatsappChatModule extends ChatModule {
  constructor() {
    super();
    this.client = new Client({});
    this.dialogsRepository = new WhatsappDialogsRepository({
      client: this.client,
      messengerId: this.messengerId,
    });
  }

  client: Client;
  dialogsRepository: DialogsRepository;

  messengerId = 'whatsapp';

  authQr: Completer<string> = new Completer();
  onAuthComplete: Completer<void> = new Completer();

  async init(): Promise<void> {
    this.client.on('ready', () => {
      this.onAuthComplete.complete();
    });
    await this.client.initialize();
  }

  async checkSignedIn(): Promise<void> {}

  async signIn(): Promise<void> {
    this.client.on('qr', this.authQr.complete);
    await this.client.initialize();
  }
}
