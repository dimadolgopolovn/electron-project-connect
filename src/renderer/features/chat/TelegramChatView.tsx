import styled from '@emotion/styled';
import { DialogEntity } from 'chat-module';
import React, { useCallback, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Api } from 'telegram';
import {
  TelegramChatModule,
  TelegramChatRepository,
} from 'telegram-chat-module';
import { NewMessage, NewMessageEvent } from 'telegram/events';

const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

const OtherMessage = styled.div`
  align-self: flex-start;
  background-color: #24303f;
  padding: 10px 15px;
  border-radius: 15px;
  max-width: 60%;
  word-wrap: break-word;
  margin-bottom: 8px;
  display: flex;
  flex-direction: column; /* Stacks photo and text vertically */
`;

const UserMessage = styled.div`
  align-self: flex-end;
  background-color: #486993;
  padding: 10px 15px;
  border-radius: 15px;
  max-width: 60%;
  word-wrap: break-word;
  margin-bottom: 8px;
  display: flex;
  flex-direction: column; /* Stacks photo and text vertically */
`;

type TimeStampProps = {
  isUser: boolean;
};

const TimeStamp = styled.div<TimeStampProps>`
  font-size: 12px;
  color: #999;
  margin-top: 5px;
  text-align: ${(props) => (props.isUser ? 'right' : 'left')};
`;

const InputContainer = styled.div`
  display: flex;
  padding: 10px;
  background-color: #1a222c;
  position: fixed;
  bottom: 0;
  width: 75%;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  border-radius: 20px;
  border: 1px solid #ccc;
  background-color: #1a222c;
  outline: none;
  font-size: 16px;
`;

const SendButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  margin-left: 10px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const formatTime = (date: number) => {
  const options: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: 'numeric',
  };
  return new Date(date).toLocaleTimeString([], options);
};

const fetchMessages = async (
  chatId: string,
  chatRepository: TelegramChatRepository,
  newerThanId?: number | undefined,
): Promise<Api.Message[]> => {
  const messages = await chatRepository.getMessages(chatId, {
    limit: 15,
    maxId: newerThanId,
  });
  return messages;
};

const downloadPhoto = async (
  message: Api.Message,
): Promise<undefined | string> => {
  const media = await message.downloadMedia();
  if (typeof media === 'string') return media;
  return media?.toString('base64');
};

const PhotoMessage: React.FC<{ message: Api.Message }> = ({ message }) => {
  const [photo, setPhoto] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPhoto = async () => {
      const photoBase64 = await downloadPhoto(message);
      if (photoBase64) {
        setPhoto(photoBase64);
      }
      setIsLoading(false);
    };
    loadPhoto();
  }, [message]);

  return (
    <>
      {isLoading ? (
        <div>Loading photo...</div> // Loader for photo
      ) : (
        <img
          src={`data:image/jpeg;base64,${photo}`}
          alt="Message media"
          style={{ width: '300px', height: '200px', marginBottom: '10px' }}
        />
      )}
    </>
  );
};

export const TelegramChatView: React.FC<{
  chatModule: TelegramChatModule;
  dialogEntity: DialogEntity;
}> = ({ chatModule, dialogEntity }) => {
  const [messages, setMessages] = useState<Api.Message[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const getMessages = async (lastMessageId: number | undefined) => {
    try {
      const fetchedMessages = await fetchMessages(
        dialogEntity.id!,
        chatModule.chatRepository,
        lastMessageId,
      );
      if (fetchedMessages.length === 0) {
        setHasMore(false);
      }
      setMessages((messages) => [...messages, ...fetchedMessages]);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };
  const onNewMessage = useCallback(
    (messageEvent: NewMessageEvent) => {
      const message = messageEvent.message;
      const dialogId = message.chatId?.toString();
      if (dialogId === dialogEntity.id) {
        setMessages((messages) => [...messages, message]);
      }
    },
    [messages, dialogEntity.id],
  );

  useEffect(() => {
    setMessages([]);
    setHasMore(true);
    getMessages(undefined);
    // chatModule.client.removeEventHandler(onNewMessage, new NewMessage({})); //TODO: connect logout func to removeEventHandler
  }, [dialogEntity.id]);

  useEffect(() => {
    chatModule.client.addEventHandler(onNewMessage, new NewMessage({}));
  }, []);

  const handleSendMessage = () => {};
  return (
    <div>
      <div
        id="scrollableDiv"
        style={{
          height: '100%',
          overflow: 'auto',
          width: '100%',
          backgroundColor: '#1a222c',
          padding: '20px',
        }}
      >
        <InfiniteScroll
          dataLength={messages.length}
          next={() =>
            getMessages(
              messages.length === 0
                ? undefined
                : messages[messages.length - 1].id,
            )
          }
          hasMore={hasMore}
          loader={<h4>Loading...</h4>}
          style={{ display: 'flex', flexDirection: 'column' }}
          // inverse={true}
          scrollableTarget="scrollableDiv"
          endMessage={
            <p style={{ textAlign: 'center' }}>
              <b>Yay! You have seen it all</b>
            </p>
          }
          pullDownToRefreshThreshold={50}
          pullDownToRefreshContent={
            <h3 style={{ textAlign: 'center' }}>
              &#8595; Pull down to refresh
            </h3>
          }
          releaseToRefreshContent={
            <h3 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h3>
          }
        >
          {messages.map((msg, index) => (
            <MessageContainer key={index}>
              {chatModule.chatRepository.isMyMessage(msg) ? (
                <UserMessage>
                  {msg.media && <PhotoMessage message={msg} />}
                  {msg.text}
                </UserMessage>
              ) : (
                <OtherMessage>
                  {msg.media && <PhotoMessage message={msg} />}
                  {msg.text}
                </OtherMessage>
              )}
              <TimeStamp isUser={chatModule.chatRepository.isMyMessage(msg)}>
                {formatTime(msg.date)}
              </TimeStamp>
            </MessageContainer>
          ))}
        </InfiniteScroll>
      </div>

      <InputContainer>
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type a message..."
        />
        <SendButton onClick={handleSendMessage}>Send</SendButton>
      </InputContainer>
    </div>
  );
};
