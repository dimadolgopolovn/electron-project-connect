import styled from '@emotion/styled';
import { DialogEntity } from 'chat-module';
import React, { useEffect, useState } from 'react';
import { Api } from 'telegram';
import {
  TelegramChatModule,
  TelegramChatRepository,
} from 'telegram-chat-module';

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  background-color: #1a222c;
  padding: 20px;
  overflow-y: auto;
`;

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
`;

const UserMessage = styled.div`
  align-self: flex-end;
  background-color: #486993;
  padding: 10px 15px;
  border-radius: 15px;
  max-width: 60%;
  word-wrap: break-word;
  margin-bottom: 8px;
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
): Promise<Api.Message[]> => {
  const messages = await chatRepository.getMessages(chatId, {
    limit: 10,
  });
  return messages.reverse();
};

export const TelegramChatView: React.FC<{
  chatModule: TelegramChatModule;
  dialogEntity: DialogEntity;
}> = ({ chatModule, dialogEntity }) => {
  const [messages, setMessages] = useState<Api.Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  useEffect(() => {
    const getMessages = async () => {
      try {
        const fetchedMessages = await fetchMessages(
          dialogEntity.id!,
          chatModule.chatRepository,
        );
        setMessages(fetchedMessages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
    getMessages();
  }, [dialogEntity.id]);

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const newMessage = {
        isUser: true,
        text: inputValue,
        time: new Date().toLocaleTimeString(),
      };
      // setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInputValue(''); // Clear the input field
    }
  };
  return (
    <div>
      <ChatContainer>
        {messages.map((msg, index) => (
          <MessageContainer key={index}>
            {chatModule.chatRepository.isMyMessage(msg) ? (
              <UserMessage>{msg.text}</UserMessage>
            ) : (
              <OtherMessage>{msg.text}</OtherMessage>
            )}
            <TimeStamp isUser={chatModule.chatRepository.isMyMessage(msg)}>
              {formatTime(msg.date)}
            </TimeStamp>
          </MessageContainer>
        ))}
      </ChatContainer>

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
