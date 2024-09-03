import {
  DialogEntity,
  GetDialogsRequest,
} from '../entities/dialog_list_entities';

export abstract class DialogsRepository {
  abstract getChats(request: GetDialogsRequest): Promise<DialogEntity[]>;
  abstract getChatById(chatId: string): Promise<DialogEntity>;
}
