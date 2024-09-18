import { Client } from 'whatsapp-web.js';
import { ChatModule } from '../common/chat_module';
import { DialogsRepository } from '../common/repositories/dialogs_repository';
import { Completer } from '../common/utils/completer';
import { WhatsappDialogsRepository } from './whatsapp_dialogs_repository';

export class WhatsappChatModule extends ChatModule {
  client: Client;
  dialogsRepository: DialogsRepository;
  messengerId = 'whatsapp';
  authQr: Promise<string>;
  onReady: Promise<void>;
  onAuthComplete: Completer<void> = new Completer<void>();

  constructor({
    client,
    authQr,
    onReady,
  }: {
    client: Client;
    authQr: Promise<string>;
    onReady: Promise<void>;
  }) {
    super();
    this.client = client;
    this.authQr = authQr;
    this.onReady = onReady;
    onReady.then(this.onAuthComplete.complete);
    this.dialogsRepository = new WhatsappDialogsRepository({
      client: this.client,
      messengerId: this.messengerId,
    });
  }

  static async getWADependencies(): Promise<
    | { client: Client; authQr: Promise<string>; onReady: Promise<void> }
    | undefined
  > {
    const dependencies = require('@electron/remote').require('./main');
    const client = dependencies.getWhatsAppClient();
    if (!client) return undefined;
    const authQr = dependencies.getWhatsAppQrPromise();
    const onReady = dependencies.getWhatsAppReadyPromise();
    return { client, authQr, onReady: onReady };
  }

  async init(): Promise<void> {
    // not required for wa
  }

  async checkSignedIn(): Promise<void> {
    // not required for wa
  }
}
