import { DialogEntity, DialogsRepository, GetDialogsRequest, LastMessageEntity } from 'chat-module';
import { Client } from 'whatsapp-web.js';
export declare class WhatsappDialogsRepository extends DialogsRepository {
    constructor({ messengerId, client, }: {
        messengerId: string;
        client: Client;
    });
    messengerId: string;
    client: Client;
    getDialogsList(request: GetDialogsRequest): Promise<DialogEntity[]>;
    addNewMessageHandler(callback: (event: LastMessageEntity) => void): void;
    removeNewMessageHandler(callback: (event: LastMessageEntity) => void): void;
}
