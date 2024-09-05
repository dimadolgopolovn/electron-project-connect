"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toDialogEntity = exports.toLastMessageEntity = void 0;
var toLastMessageEntity = function (lastMessage) {
    var _a;
    var messengerId = 'telegram';
    var telegramMedia = lastMessage === null || lastMessage === void 0 ? void 0 : lastMessage.media;
    var lastMessageMedia;
    if (telegramMedia && telegramMedia.className === 'MessageMediaPhoto') {
        lastMessageMedia = {
            spoiler: telegramMedia.spoiler,
            url: (_a = telegramMedia.photo) === null || _a === void 0 ? void 0 : _a.id, // TODO (gicha): implement this with the correct value
        };
    }
    var dialogId;
    switch (lastMessage.peerId.className) {
        case 'PeerUser':
            dialogId = lastMessage.peerId.userId.toString();
            break;
        case 'PeerChat':
            dialogId = lastMessage.peerId.chatId.toString();
            break;
        case 'PeerChannel':
            dialogId = lastMessage.peerId.channelId.toString();
            break;
    }
    return {
        messengerId: messengerId,
        id: lastMessage === null || lastMessage === void 0 ? void 0 : lastMessage.id.toString(),
        date: lastMessage === null || lastMessage === void 0 ? void 0 : lastMessage.date,
        dialogId: dialogId,
        messageText: lastMessage === null || lastMessage === void 0 ? void 0 : lastMessage.message,
        media: lastMessageMedia,
        views: lastMessage === null || lastMessage === void 0 ? void 0 : lastMessage.views,
        postAuthor: lastMessage === null || lastMessage === void 0 ? void 0 : lastMessage.postAuthor,
    };
};
exports.toLastMessageEntity = toLastMessageEntity;
var toDialogEntity = function (dialog) {
    var _a;
    var lastMessage = dialog.message;
    return {
        messengerId: 'telegram',
        pinned: dialog.pinned,
        archived: dialog.archived,
        message: lastMessage === undefined ? undefined : (0, exports.toLastMessageEntity)(lastMessage),
        date: dialog.date,
        id: (_a = dialog === null || dialog === void 0 ? void 0 : dialog.id) === null || _a === void 0 ? void 0 : _a.toString(),
        name: dialog === null || dialog === void 0 ? void 0 : dialog.name,
        title: dialog === null || dialog === void 0 ? void 0 : dialog.title,
        unreadCount: dialog.unreadCount,
        unreadMentionsCount: dialog.unreadMentionsCount,
        isUser: dialog.isUser,
        isGroup: dialog.isGroup,
        isChannel: dialog.isChannel,
    };
};
exports.toDialogEntity = toDialogEntity;
