"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toDialogEntity = exports.toLastMessageEntity = void 0;
const toLastMessageEntity = (lastMessage) => {
    const messengerId = 'telegram';
    let telegramMedia = lastMessage?.media;
    let lastMessageMedia;
    if (telegramMedia && telegramMedia.className === 'MessageMediaPhoto') {
        lastMessageMedia = {
            spoiler: telegramMedia.spoiler,
            url: telegramMedia.photo?.id, // TODO (gicha): implement this with the correct value
        };
    }
    let dialogId = lastMessage.chatId?.toString();
    return {
        messengerId: messengerId,
        id: lastMessage?.id.toString(),
        date: lastMessage?.date,
        dialogId: dialogId,
        messageText: lastMessage?.message,
        media: lastMessageMedia,
        views: lastMessage?.views,
        postAuthor: lastMessage?.postAuthor,
    };
};
exports.toLastMessageEntity = toLastMessageEntity;
const dialogPhotoPromise = async (client, entity) => {
    const photoFile = await client.downloadProfilePhoto(entity);
    if (typeof photoFile === 'string')
        return photoFile;
    return photoFile?.toString('base64');
};
const toDialogEntity = (client, dialog) => {
    const lastMessage = dialog.message;
    console.log('dialog', dialog);
    let chatPhoto = dialogPhotoPromise(client, dialog.entity);
    console.log('chatPhoto', chatPhoto);
    return {
        messengerId: 'telegram',
        pinned: dialog.pinned,
        archived: dialog.archived,
        message: lastMessage === undefined ? undefined : (0, exports.toLastMessageEntity)(lastMessage),
        date: dialog.date,
        id: dialog?.id?.toString(),
        name: dialog?.name,
        title: dialog?.title,
        unreadCount: dialog.unreadCount,
        unreadMentionsCount: dialog.unreadMentionsCount,
        isUser: dialog.isUser,
        isGroup: dialog.isGroup,
        isChannel: dialog.isChannel,
        photoBase64: chatPhoto,
    };
};
exports.toDialogEntity = toDialogEntity;
