import { ChatModule } from '../chat_module';
import {
  DialogEntity,
  GetDialogsRequest,
} from '../entities/dialog_list_entities';

export class DialogAggregator {
  constructor(modules: ChatModule[]) {
    this.modules = modules;
  }

  modules: ChatModule[];

  async getDialogsList(request: GetDialogsRequest): Promise<DialogEntity[]> {
    const dialogs = await Promise.all(
      this.modules
        .filter((module) => module.onAuthComplete.completed !== false)
        .map((module) => module.dialogsRepository.getDialogsList(request)),
    );
    return dialogs.flat();
  }
}
