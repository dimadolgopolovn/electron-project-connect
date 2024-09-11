"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramChatModule = void 0;
const chat_module_1 = require("chat-module");
const telegram_1 = require("telegram");
const telegram_auth_repository_1 = require("./repositories/telegram_auth_repository");
const telegram_chat_repository_1 = require("./repositories/telegram_chat_repository");
const telegram_dialogs_repository_1 = require("./repositories/telegram_dialogs_repository");
class TelegramChatModule extends chat_module_1.ChatModule {
    constructor({ storeSession, apiId, apiHash, }) {
        super();
        this.client = new telegram_1.TelegramClient(storeSession, apiId, apiHash, {
            connectionRetries: 5,
            useWSS: true,
        });
        this.dialogsRepository = new telegram_dialogs_repository_1.TelegramDialogsRepository({
            telegramClient: this.client,
            messengerId: this.messengerId,
        });
        this.authRepository = new telegram_auth_repository_1.TelegramAuthRepository({
            telegramClient: this.client,
        });
        this.chatRepository = new telegram_chat_repository_1.TelegramChatRepository({
            telegramClient: this.client,
        });
    }
    client;
    dialogsRepository;
    authRepository;
    chatRepository;
    messengerId = 'telegram';
    async init() {
        await this.client.connect();
        await this.authRepository.init();
        await this.fetchMyUser();
    }
    get onAuthComplete() {
        return this.authRepository.ready;
    }
    async fetchMyUser() {
        try {
            const myUser = await this.authRepository.getMyUser();
            this.chatRepository.setMyUserId(myUser.id);
        }
        catch (error) {
            console.log('Error fetching my user)');
        }
    }
    checkSignedIn() {
        return this.authRepository.fetchSession();
    }
}
exports.TelegramChatModule = TelegramChatModule;
