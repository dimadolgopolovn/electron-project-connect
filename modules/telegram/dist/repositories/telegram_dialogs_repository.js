"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramDialogsRepository = void 0;
var chat_module_1 = require("chat-module");
var TelegramDialogsRepository = /** @class */ (function (_super) {
    __extends(TelegramDialogsRepository, _super);
    function TelegramDialogsRepository(_a) {
        var telegramClient = _a.telegramClient;
        var _this = _super.call(this) || this;
        _this.telegramClient = telegramClient;
        return _this;
    }
    TelegramDialogsRepository.prototype.getChats = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var telegramDialogs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.telegramClient.getDialogs({
                            limit: request.limit,
                            offsetDate: request.offsetDate,
                            offsetId: request.offsetId,
                            ignorePinned: request.ignorePinned,
                            folder: request.folder,
                            archived: request.archived,
                        })];
                    case 1:
                        telegramDialogs = _a.sent();
                        return [2 /*return*/, telegramDialogs.map(function (dialog) {
                                var _a;
                                var lastMessage = dialog.message;
                                var telegramMedia = lastMessage === null || lastMessage === void 0 ? void 0 : lastMessage.media;
                                var lastMessageMedia;
                                if (telegramMedia && telegramMedia.className === 'MessageMediaPhoto') {
                                    lastMessageMedia = {
                                        spoiler: telegramMedia.spoiler,
                                        url: (_a = telegramMedia.photo) === null || _a === void 0 ? void 0 : _a.id, // TODO (gicha): implement this with the correct value
                                    };
                                }
                                var lastMessageFromId;
                                if ((lastMessage === null || lastMessage === void 0 ? void 0 : lastMessage.fromId) && lastMessage.fromId.className === 'PeerUser') {
                                    lastMessageFromId = {
                                        userId: lastMessage.fromId.userId,
                                    };
                                }
                                var lastMessageToId;
                                if ((lastMessage === null || lastMessage === void 0 ? void 0 : lastMessage.toId) && lastMessage.toId.className === 'PeerUser') {
                                    lastMessageToId = {
                                        userId: lastMessage.toId.userId,
                                    };
                                }
                                return {
                                    pinned: dialog.pinned,
                                    archived: dialog.archived,
                                    message: {
                                        id: lastMessage === null || lastMessage === void 0 ? void 0 : lastMessage.id,
                                        out: lastMessage === null || lastMessage === void 0 ? void 0 : lastMessage.out,
                                        date: lastMessage === null || lastMessage === void 0 ? void 0 : lastMessage.date,
                                        fromId: lastMessageFromId,
                                        toId: lastMessageToId,
                                        messageText: lastMessage === null || lastMessage === void 0 ? void 0 : lastMessage.message,
                                        media: lastMessageMedia,
                                        replyTo: lastMessage === null || lastMessage === void 0 ? void 0 : lastMessage.replyTo,
                                        action: lastMessage === null || lastMessage === void 0 ? void 0 : lastMessage.action,
                                        entities: lastMessage === null || lastMessage === void 0 ? void 0 : lastMessage.entities,
                                        views: lastMessage === null || lastMessage === void 0 ? void 0 : lastMessage.views,
                                        editDate: lastMessage === null || lastMessage === void 0 ? void 0 : lastMessage.editDate,
                                        groupedId: lastMessage === null || lastMessage === void 0 ? void 0 : lastMessage.groupedId,
                                        postAuthor: lastMessage === null || lastMessage === void 0 ? void 0 : lastMessage.postAuthor,
                                        ttlPeriod: lastMessage === null || lastMessage === void 0 ? void 0 : lastMessage.ttlPeriod,
                                    },
                                    date: dialog.date,
                                    id: dialog === null || dialog === void 0 ? void 0 : dialog.id,
                                    name: dialog === null || dialog === void 0 ? void 0 : dialog.name,
                                    title: dialog === null || dialog === void 0 ? void 0 : dialog.title,
                                    unreadCount: dialog.unreadCount,
                                    unreadMentionsCount: dialog.unreadMentionsCount,
                                    isUser: dialog.isUser,
                                    isGroup: dialog.isGroup,
                                    isChannel: dialog.isChannel,
                                };
                            })];
                }
            });
        });
    };
    TelegramDialogsRepository.prototype.getChatById = function (chatId) {
        throw new Error('Method not implemented.');
    };
    return TelegramDialogsRepository;
}(chat_module_1.DialogsRepository));
exports.TelegramDialogsRepository = TelegramDialogsRepository;
