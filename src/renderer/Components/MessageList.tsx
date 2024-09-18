import React, { useCallback, useEffect, useState } from 'react'
import { IChatItemProps, MessageList, MessageType } from 'react-chat-elements'
import 'react-chat-elements/dist/main.css'
import styled from '@emotion/styled'
import { DialogEntity } from '../modules/common/entities/dialog_list_entities'
import { mapArrayWithDateToDateString } from '../util'
import { LastMessageEntity } from '../modules/common/entities/dialog_entities'
import { useTelegramChat } from '../Hooks/useTelegramChat'
import { type TotalList } from 'telegram/Helpers'
import { type Api } from 'telegram'

const TITLE_COLOR = '#A0A8AF'
const DATE_COLOR = '#A1AAB3'
const MESSAGE_TEXT_COLOR = '#FFFFFF'

// Sample Data
const messages: MessageType[] = [
  {
    id: 0,
    position: 'left',
    type: 'text',
    text: 'Hello, how are you?',
    date: new Date(),
    title: 'User', // Add this line
    status: 'sent',
  },
  {
    id: 1,
    position: 'right',
    type: 'text',
    text: 'I am fine, thank you!',
    date: new Date(),
    title: 'User', // Add this line
    status: 'sent',
  },
  // {
  //   id: 2,
  //   position: 'left',
  //   type: 'photo',
  //   text: '',
  //   data: {
  //     uri: 'https://via.placeholder.com/150',
  //   },
  //   date: new Date(),
  // },
]

const StyledMessageList = styled(MessageList)`
  margin-top: 18px;
  /* margin-left: 10px; */
  /* margin-right: 10px; */
  margin-bottom: 18px;

  .rce-container-mbox:not(:last-child) {
    margin-bottom: 16px;
  }

  .flat-message {
    display: flex;
    align-items: flex-start;
    padding-left: 20px;
    padding-right: 20px;
  }

  .flat-message-avatar {
    width: 38px;
    height: 38px;
    margin-right: 10px;
    background-color: #888;
    border-radius: 50%;
  }

  .flat-message-content {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .flat-message-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 2px; // this is to make Avatar and the first line of the message align. Need to adjust manually if layout changes
    margin-bottom: 2px;

    /* title slightly bigger than date and bold */
    /* text slightly bigger than title */
    // NAME
    & .flat-message-title {
      font-size: 0.82em;
      color: ${TITLE_COLOR};
      font-weight: bold;
    }

    // DATE
    & .flat-message-date {
      font-size: 0.8em;
      color: ${DATE_COLOR};
    }
  }

  .flat-message-body {
    background: transparent;
    padding: 0;
    border-radius: 0;

    font-size: 0.88em;

    // TEXT
    & .flat-message-text {
      white-space: pre-wrap;
      color: ${MESSAGE_TEXT_COLOR};
    }
  }
`
const ChatView: React.FC<{ dialogEntity: DialogEntity }> = ({
  dialogEntity,
}) => {
  const ref = React.createRef<HTMLDivElement>()

  const telegramModule = useTelegramChat()

  // Mind that messages have to be converted and dated for UI
  const [messages, setMessages] = useState<MessageType[]>([])
  const [hasMore, setHasMore] = useState(true)

  // depends on chatId, chatRepository (why?), newerThanId?
  const fetchMessages = async (lastMessageId?: number) => {
    try {
      // TODO: Replace this with actual API call to fetch messages
      const fetchedMessages = await telegramModule?.chatRepository.getMessages(
        dialogEntity.id!,
        {
          limit: 15,
          maxId: lastMessageId,
        },
      )
      // TODO: Is this the best way to work with fetchedMessages = undefined?
      if (fetchedMessages?.length === 0) {
        setHasMore(false)
      }
      return fetchedMessages || []
    } catch (error) {
      console.error('Error fetching messages:', error)
      return []
    }
  }

  const getMessages = async (lastMessageId?: number) => {
    const fetchedMessages = await fetchMessages(lastMessageId)

    const convertToMessageListFormat = (
      messages: TotalList<Api.Message>,
    ): MessageType[] => {
      return messages.map((message) => ({
        id: message.id,
        position: 'left',
        type: 'text',
        title: String(message.fromId) || 'Unknown',
        text: message.message || '',
        date: new Date(message.date),
        status: 'received',
        // You might want to add more properties here based on the MessageList component's requirements
      }))
    }

    if (fetchedMessages) {
      const convertedMessages = mapArrayWithDateToDateString(
        convertToMessageListFormat(fetchedMessages),
      )
      setMessages((prevMessages) => [...prevMessages, ...convertedMessages])
    }
  }

  useEffect(() => {
    setMessages([])
    setHasMore(true)
    getMessages()

    // Add new message handler
    // dialogEntity.messengerId.dialogsRepository.addNewMessageHandler(
    //   onNewMessage,
    // )

    return () => {
      // Remove new message handler on cleanup
      // dialogEntity.messengerId.dialogsRepository.removeNewMessageHandler(
      //   onNewMessage,
      // )
    }
  }, [dialogEntity?.id])

  const loadMoreMessages = () => {
    if (messages.length > 0) {
      const oldestMessageId = messages[0].id as string
      getMessages(Number(oldestMessageId))
    }
  }

  return (
    <StyledMessageList
      reference={ref}
      className="message-list"
      lockable={true}
      toBottomHeight={'100%'}
      dataSource={messages}
      // Add onLoadMore, hasMore (?)
    />
  )
}

export default ChatView
