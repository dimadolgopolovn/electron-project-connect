import { DialogsRepository } from './repositories/dialogs_repository';
export declare abstract class ChatModule {
    abstract enabled: boolean;
    abstract dialogsRepository: DialogsRepository;
    abstract init(): Promise<void>;
    abstract checkSignedIn(): Promise<void>;
}
