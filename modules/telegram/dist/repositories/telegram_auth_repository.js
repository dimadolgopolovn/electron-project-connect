"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramAuthRepository = void 0;
const chat_module_1 = require("chat-module");
class TelegramAuthRepository {
    constructor({ telegramClient }) {
        this.telegramClient = telegramClient;
    }
    telegramClient;
    ready = new chat_module_1.Completer();
    get hasSession() {
        return this.telegramClient.session.authKey !== undefined;
    }
    async fetchSession() {
        await this.telegramClient.session.load();
    }
    async init() {
        this.telegramClient.onError = async (err) => {
            console.log(err);
        };
        await this.fetchSession();
    }
    async signIn({ phoneProvider, passwordProvider, codeProvider, }) {
        await this.telegramClient.start({
            phoneNumber: phoneProvider,
            password: passwordProvider,
            phoneCode: codeProvider,
            onError: (err) => {
                console.log(err);
                throw err;
            },
        });
        await this.telegramClient.connect();
        await this.fetchSession();
        this.ready.complete();
        console.log('You should now be connected.');
        console.log(this.telegramClient.session.save()); // Save this string to avoid logging in again
    }
    async getMyUser() {
        return this.telegramClient.getMe();
    }
    async logout() {
        await this.telegramClient.disconnect();
        this.telegramClient.session.setAuthKey(undefined);
        this.telegramClient.session.save();
    }
}
exports.TelegramAuthRepository = TelegramAuthRepository;
