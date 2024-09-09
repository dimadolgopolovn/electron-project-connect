import React from 'react'
import { MessageList, MessageType } from 'react-chat-elements'
import 'react-chat-elements/dist/main.css'

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

import styled from '@emotion/styled'
import { mapArrayWithDateToDateString } from '../util'

const StyledMessageList = styled(MessageList)`
  margin-left: 10px;

  .flat-message {
    display: flex;
    align-items: flex-start;
    margin-bottom: 10px;
  }

  .flat-message-avatar {
    width: 32px;
    height: 32px;
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
    margin-bottom: 5px;

    & .flat-message-title {
      font-size: 0.82em;
      color: #222;
      font-weight: bold;
    }

    & .flat-message-date {
      font-size: 0.8em;
      color: gray;
    }
  }

  .flat-message-body {
    background: #f1f1f1;
    padding: 10px;
    border-radius: 5px;

    & .flat-message-text {
      white-space: pre-wrap;
    }
  }
`

const ChatView: React.FC = () => {
  const ref = React.createRef()

  const datedMessages = mapArrayWithDateToDateString(messages)

  return (
    <StyledMessageList
      reference={ref}
      className="message-list"
      lockable={true}
      toBottomHeight={'100%'}
      dataSource={datedMessages}
    />
  )
}

export default ChatView
