import { IChatItemProps, MessageType } from 'react-chat-elements'

/**
 * Dates come as type number. Here we convert it to format we need in UI.
 * If same day, 2-digit hours with locale (24hr or ampm).
 * If it's the same week, it's 3-letter day of week.
 * If it's earlier, it's mm/dd with the right locale.
 * */
function mapArrayWithDateToDateString(chats: IChatItemProps[]): IChatItemProps[]
function mapArrayWithDateToDateString(chats: MessageType[]): MessageType[]
function mapArrayWithDateToDateString(
  chats: IChatItemProps[] | MessageType[],
): IChatItemProps[] | MessageType[] {
  // TODO: Some people like Monday as the first day of the week
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
