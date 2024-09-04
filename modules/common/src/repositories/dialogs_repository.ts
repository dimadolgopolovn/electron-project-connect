import { LastMessageEntity } from '../entities/dialog_entities';
import {
  DialogEntity,
  GetDialogsRequest,
} from '../entities/dialog_list_entities';

export abstract class DialogsRepository {
  abstract getDialogsList(request: GetDialogsRequest): Promise<DialogEntity[]>;
  abstract onMessageReceived(newMessage: LastMessageEntity): void;
}
