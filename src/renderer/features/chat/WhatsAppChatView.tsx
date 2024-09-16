import styled from '@emotion/styled';
import React, { useCallback, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import { Chat, Message } from 'whatsapp-web.js';
import { DialogEntity } from '../../modules/common/entities/dialog_list_entities';
import { WhatsappChatModule } from '../../modules/whatsapp/whatsapp-chat-module';

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

const PhotoMessage: React.FC<{ message: Message }> = ({ message }) => {
  const [photo, setPhoto] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPhoto = async () => {
      const media = await message.downloadMedia();
      const photoBase64 = media.data;
      if (photoBase64) setPhoto(photoBase64);
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

export const WhatsAppChatView: React.FC<{
  chatModule: WhatsappChatModule;
  dialogEntity: DialogEntity;
  chat: Chat;
}> = ({ chatModule, dialogEntity, chat }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const getMessages = async (lastMessageId: number | undefined) => {
    try {
      const fetchedMessages = await chat.fetchMessages({ limit: 100 }); // wa doesn't support some normal pagination??
      setHasMore(false);
      setMessages((messages) => [...messages, ...fetchedMessages]);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };
  const onNewMessage = useCallback(
    (message: Message) => {},
    [messages, dialogEntity.id],
  );

  useEffect(() => {
    setMessages([]);
    setHasMore(true);
    getMessages(undefined);
  }, [chat]);

  useEffect(() => {
    chatModule.client.getChatById;
    chatModule.client.on('message', async (message: Message) => {
      const chat = await message.getChat(); // TODO: get real id field
      const dialogId = chat.id.user;
      if (dialogId === dialogEntity.id) {
        setMessages((messages) => [...messages, message]);
      }
    });
  }, [chat]);

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
          next={() => getMessages(undefined)}
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
              {msg.fromMe ? (
                <UserMessage>
                  {msg.hasMedia && <PhotoMessage message={msg} />}
                  {msg.body}
                </UserMessage>
              ) : (
                <OtherMessage>
                  {msg.hasMedia && <PhotoMessage message={msg} />}
                  {msg.body}
                </OtherMessage>
              )}
              <TimeStamp isUser={msg.fromMe}>
                {formatTime(msg.timestamp)}
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
