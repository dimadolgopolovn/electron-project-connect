"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramChatRepository = void 0;
class TelegramChatRepository {
    constructor({ telegramClient }) {
        this.client = telegramClient;
    }
    client;
    myUserId;
    setMyUserId(userId) {
        this.myUserId = userId;
    }
    async getMessages(entity, getMessagesParams) {
        return this.client.getMessages(entity, getMessagesParams);
    }
    isMyMessage(message) {
        return message.senderId?.equals(this.myUserId) ?? false;
    }
}
exports.TelegramChatRepository = TelegramChatRepository;
