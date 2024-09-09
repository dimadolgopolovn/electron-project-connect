import { IChatItemProps, MessageType } from 'react-chat-elements'

function mapArrayWithDateToDateString(chats: IChatItemProps[]): IChatItemProps[]
function mapArrayWithDateToDateString(chats: MessageType[]): MessageType[]
function mapArrayWithDateToDateString(
  chats: IChatItemProps[] | MessageType[],
): IChatItemProps[] | MessageType[] {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const today = new Date()
  const isToday = (someDate: Date) => {
    return (
      someDate.getDate() === today.getDate() &&
      someDate.getMonth() === today.getMonth() &&
      someDate.getFullYear() === today.getFullYear()
    )
  }
  const isThisWeek = (someDate: Date) => {
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(today.getDate() - 7)
    return someDate > oneWeekAgo
  }

  return chats.map((chat) => {
    if (chat.date) {
      const chatDate =
        typeof chat.date === 'number' ? new Date(chat.date) : chat.date
      let dateString = ''

      if (isToday(chatDate)) {
        dateString = chatDate.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })
      } else if (isThisWeek(chatDate)) {
        dateString = daysOfWeek[chatDate.getDay()]
      } else {
        dateString = chatDate.toLocaleDateString()
      }

      return { ...chat, dateString }
    }
    return chat
  }) as IChatItemProps[] | MessageType[]
}

export { mapArrayWithDateToDateString }
