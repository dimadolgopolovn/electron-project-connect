"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramDialogsRepository = void 0;
const chat_module_1 = require("chat-module");
const events_1 = require("telegram/events");
const converters_1 = require("../utils/converters");
class TelegramDialogsRepository extends chat_module_1.DialogsRepository {
    constructor({ telegramClient, messengerId, }) {
        super();
        this.telegramClient = telegramClient;
        this.messengerId = messengerId;
    }
    telegramClient;
    messengerId;
    async getDialogsList(request) {
        const telegramDialogs = await this.telegramClient.getDialogs({
            limit: request.limit,
            offsetDate: request.offsetDate,
            offsetId: request.offsetId,
            ignorePinned: request.ignorePinned,
            folder: request.folder,
            archived: request.archived,
        });
        return telegramDialogs.map((dialog) => (0, converters_1.toDialogEntity)(this.telegramClient, dialog));
    }
    messageCallbackMap = new Map();
    addNewMessageHandler(callback) {
        const tgCallback = (event) => {
            const messageData = event.message;
            if (messageData === undefined)
                return;
            const message = messageData;
            callback((0, converters_1.toLastMessageEntity)(message));
        };
        this.messageCallbackMap.set(callback, tgCallback);
        this.telegramClient.addEventHandler(tgCallback, new events_1.NewMessage({}));
    }
    removeNewMessageHandler(callback) {
        const tgCallback = this.messageCallbackMap.get(callback);
        if (tgCallback) {
            this.messageCallbackMap.delete(callback);
            this.telegramClient.removeEventHandler(tgCallback, new events_1.NewMessage({}));
        }
    }
}
exports.TelegramDialogsRepository = TelegramDialogsRepository;
