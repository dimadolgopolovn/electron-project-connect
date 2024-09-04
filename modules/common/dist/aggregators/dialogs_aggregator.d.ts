import { ChatModule } from '../chat_module';
import { DialogEntity, GetDialogsRequest } from '../entities/dialog_list_entities';
export declare class DialogAggregator {
    constructor(modules: ChatModule[]);
    modules: ChatModule[];
    getDialogsList(request: GetDialogsRequest): Promise<DialogEntity[]>;
}
