import { ChatModule, DialogEntity } from 'chat-module';

export const ChatView: React.FC<{
  modules: ChatModule[];
  dialogEntity: DialogEntity;
}> = ({ modules, dialogEntity }) => {
  return <div>ChatView</div>;
  // if (dialogEntity.messengerId === 'telegram') {
  //   return (
  //     <TelegramChatView
  //       chatModule={
  //         modules.find(
  //           (module) => module.messengerId === 'telegram',
  //         ) as TelegramChatModule
  //       }
  //       dialogEntity={dialogEntity}
  //     />
  //   );
  // }
  // return <div>Unknown Chat</div>;
};
