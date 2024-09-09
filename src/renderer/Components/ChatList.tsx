import React from 'react'
import { ChatList, IChatItemProps } from 'react-chat-elements'
import 'react-chat-elements/dist/main.css'
import { mapArrayWithDateToDateString } from '../util'

// Sample Data
const chats: IChatItemProps[] = [
  {
    id: 0,
    avatar: 'https://via.placeholder.com/50',
    alt: 'Dmitry Nikiforov',
    title: 'Dmitry Nikiforov',
    subtitle: 'Hey, are we still on for the meeting tomorrow?',
    date: new Date(),
    unread: 2,
  },
  {
    id: 1,
    avatar: 'https://via.placeholder.com/50',
    alt: 'Elena V.',
    title: 'Elena V.',
    subtitle: "Sure, I'll send the documents later today.",
    date: new Date(),
    unread: 1,
  },
  {
    id: 2,
    avatar: 'https://via.placeholder.com/50',
    alt: 'Telegram Group',
    title: 'Telegram Group',
    subtitle: "Alice: Don't forget the deadlines!",
    date: new Date(Date.now() - 86400000), // Yesterday
    unread: 0,
  },
]

const ListOfChats: React.FC = () => {
  const chatsWithDateString = mapArrayWithDateToDateString(chats)

  return (
    <ChatList
      // className="chat-list"
      dataSource={chatsWithDateString}
    />
  )
}

export default ListOfChats
