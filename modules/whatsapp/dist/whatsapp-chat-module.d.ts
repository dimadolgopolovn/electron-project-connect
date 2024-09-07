import { ChatModule, Completer, DialogsRepository } from 'chat-module';
import { Client } from 'whatsapp-web.js';
export declare class WhatsappChatModule extends ChatModule {
    constructor();
    client: Client;
    dialogsRepository: DialogsRepository;
    messengerId: string;
    authQr: Completer<string>;
    onAuthComplete: Completer<void>;
    init(): Promise<void>;
    checkSignedIn(): Promise<void>;
    signIn(): Promise<void>;
}
