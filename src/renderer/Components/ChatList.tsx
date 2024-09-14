import React from 'react'
import { ChatList, IChatItemProps } from 'react-chat-elements'
import 'react-chat-elements/dist/main.css'
import { mapArrayWithDateToDateString } from '../util'
import styled from '@emotion/styled'

const DATE_TEXT_COLOR = '#95999a'
const NAME_TEXT_COLOR = '#E3E4E6'
const LAST_MESSAGE_TEXT_COLOR = '#BCBCBC'
const NOTIFICATION_BG_COLOR = '#3F4144'
const NOTIFICATION_TEXT_COLOR = '#FAFAFA'
const SIDE_PADDING = '5px'

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

// TODO: Move this to our library instead
const CustomChatList = styled(ChatList)`
  background-color: transparent;

  // chat item bg
  & .rce-citem {
    background-color: transparent;
    padding-left: ${SIDE_PADDING};
    padding-right: calc(${SIDE_PADDING} + 3px);
  }

  // date
  & .rce-citem-body--top-time {
    color: ${DATE_TEXT_COLOR};
  }

  // name
  & .rce-citem-body--top-title {
    color: ${NAME_TEXT_COLOR};
  }

  // notification
  & .rce-citem-body--bottom-status {
    span {
      background-color: ${NOTIFICATION_BG_COLOR};
      color: ${NOTIFICATION_TEXT_COLOR};
    }
  }

  // last text
  & .rce-citem-body--bottom-title {
    color: ${LAST_MESSAGE_TEXT_COLOR};
  }
`

const ListOfChats: React.FC = () => {
  const chatsWithDateString = mapArrayWithDateToDateString(chats)

  return (
    <CustomChatList
      // className="chat-list"
      dataSource={chatsWithDateString}
    />
  )
}

export default ListOfChats
