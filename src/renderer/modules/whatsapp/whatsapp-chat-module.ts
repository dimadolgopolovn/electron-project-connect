import { Client } from 'whatsapp-web.js';
import { ChatModule } from '../common/chat_module';
import { DialogsRepository } from '../common/repositories/dialogs_repository';
import { Completer } from '../common/utils/completer';
import { WhatsappDialogsRepository } from './whatsapp_dialogs_repository';

export class WhatsappChatModule extends ChatModule {
  client: Client;
  dialogsRepository: DialogsRepository;
  messengerId = 'whatsapp';
  authQr: Completer<string> = new Completer();
  onAuthComplete: Completer<void> = new Completer();

  constructor() {
    super();
    this.client = require('@electron/remote').require('./main').getWaClient();
    console.log('Client initialized:', this.client); // Debugging client
    this.client.on('ready', () => {
      console.log('Client is ready');
      this.onAuthComplete.complete();
    });
    this.client.on('qr', (qr) => this.authQr.complete(qr));
    try {
      this.client.initialize();
    } catch (_) {}

    this.dialogsRepository = new WhatsappDialogsRepository({
      client: this.client,
      messengerId: this.messengerId,
    });
  }

  async init(): Promise<void> {
    // not required for wa
  }

  async checkSignedIn(): Promise<void> {
    // not required for wa
  }
}
