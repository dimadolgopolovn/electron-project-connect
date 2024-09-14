import React from 'react'
import { MessageList, MessageType } from 'react-chat-elements'
import 'react-chat-elements/dist/main.css'

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

import styled from '@emotion/styled'
import { mapArrayWithDateToDateString } from '../util'

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
