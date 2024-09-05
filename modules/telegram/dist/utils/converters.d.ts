import { DialogEntity, LastMessageEntity } from 'chat-module';
import { Api } from 'telegram';
import { Dialog } from 'telegram/tl/custom/dialog';
export declare const toLastMessageEntity: (lastMessage: Api.Message) => LastMessageEntity;
export declare const toDialogEntity: (dialog: Dialog) => DialogEntity;
