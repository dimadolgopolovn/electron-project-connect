import { DialogEntity, DialogsRepository, GetDialogsRequest, LastMessageEntity } from 'chat-module';
import { TelegramClient } from 'telegram';
import { NewMessageEvent } from 'telegram/events';
export declare class TelegramDialogsRepository extends DialogsRepository {
    constructor({ telegramClient, messengerId, }: {
        telegramClient: TelegramClient;
        messengerId: string;
    });
    telegramClient: TelegramClient;
    messengerId: string;
    getDialogsList(request: GetDialogsRequest): Promise<DialogEntity[]>;
    messageCallbackMap: Map<(event: LastMessageEntity) => void, (event: NewMessageEvent) => void>;
    addNewMessageHandler(callback: (event: LastMessageEntity) => void): void;
    removeNewMessageHandler(callback: (event: LastMessageEntity) => void): void;
}
