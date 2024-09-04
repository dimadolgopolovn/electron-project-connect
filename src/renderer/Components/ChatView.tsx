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

const ChatView: React.FC = () => {
  const ref = React.createRef()

  return (
    <MessageList
      referance={ref}
      className="message-list"
      lockable={true}
      toBottomHeight={'100%'}
      dataSource={messages}
    />
  )
}

export default ChatView
