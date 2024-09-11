import { ChatModule, Completer, DialogsRepository } from 'chat-module';
import { Client as WAClient } from 'whatsapp-web-electron.js';
import { WhatsappDialogsRepository } from './whatsapp_dialogs_repository';
const { Client } = require('whatsapp-web-electron.js');

export class WhatsappChatModule extends ChatModule {
  client: WAClient;
  dialogsRepository: DialogsRepository;
  messengerId = 'whatsapp';
  authQr: Completer<string> = new Completer();
  onAuthComplete: Completer<void> = new Completer();

  constructor() {
    super();
    this.client = new Client({});
    // console.log('Client initialized:', this.client); // Debugging client

    // this.client.on('ready', () => {
    //   console.log('Client is ready');
    //   this.onAuthComplete.complete();
    // });
    // this.client.on('qr', (qr) => this.authQr.complete(qr));
    // this.client.initialize();

    this.dialogsRepository = new WhatsappDialogsRepository({
      client: this.client,
      messengerId: this.messengerId,
    });
  }

  async init(): Promise<void> {
    // console.log('Client before on "ready":', this.client);
    // this.client.on('ready', () => {
    //   console.log('Client is ready');
    //   this.onAuthComplete.complete();
    // });
    // await this.client.initialize();
  }

  async checkSignedIn(): Promise<void> {}

  async signIn(): Promise<void> {
    this.client = require('@electron/remote').require('./main').getWaClient();
    console.log('Client initialized:', this.client); // Debugging client
    this.client.on('ready', () => {
      console.log('Client is ready');
      this.onAuthComplete.complete();
    });
    this.client.on('qr', (qr) => {
      console.log('QR:', qr);
      this.authQr.complete(qr);
    });
    this.client.initialize();

    // this.client.on('qr', (qr) => this.authQr.complete(qr));
    // await this.client.initialize();
  }
}
