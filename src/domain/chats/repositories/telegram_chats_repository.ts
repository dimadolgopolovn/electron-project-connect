import { DialogEntity, GetDialogsRequest } from '../entities/chats_entities';

export abstract class TelegramDialogsRepository {
  abstract getChats(request: GetDialogsRequest): Promise<DialogEntity[]>;
  abstract getChatById(chatId: string): Promise<DialogEntity>;
}
