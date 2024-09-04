import React, { useRef, useState } from 'react'
import styled from '@emotion/styled'
import ChatList from '../Components/ChatList'
import MessageList from '../Components/MessageList'
import { Button, Input } from 'react-chat-elements'

// Styled Components
const MainContainer = styled.div`
  display: flex;
  height: 100vh;
`

const ResizableSidebar = styled.div<{ width: number }>`
  width: ${({ width }) => width}px;
  min-width: 200px;
  max-width: 500px;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  color: white;
  border-right: 1px solid #3a3a3a;
  resize: horizontal;
  overflow: auto;
`

const ChatViewContainer = styled.div`
  flex-grow: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
`

const MessageListContainer = styled.div`
  flex-grow: 1;
  overflow: auto;
`

const InputContainer = styled.div`
  border-top: 1px solid #3a3a3a;
`

const MainChatApp: React.FC = () => {
  const [sidebarWidth, setSidebarWidth] = useState(300)
  const inputRef = useRef(null)
  const inputClearRef = useRef<Function | null>(null)

  const addMessage = (data: number) => {}

  return (
    <MainContainer>
      <ResizableSidebar
        width={sidebarWidth}
        onMouseUp={(e) => setSidebarWidth(e.currentTarget.clientWidth)}
      >
        <ChatList />
      </ResizableSidebar>
      <ChatViewContainer>
        <MessageListContainer>
          <MessageList />
        </MessageListContainer>
        <InputContainer>
          <Input
            className="rce-example-input"
            placeholder="Write a message..."
            defaultValue=""
            multiline={true}
            maxlength={1000}
            onMaxLengthExceed={() => console.log('onMaxLengthExceed')}
            reference={inputRef}
            clear={(clear: any) => (inputClearRef.current = clear)}
            maxHeight={50}
            onKeyPress={(e: any) => {
              if (e.shiftKey && e.charCode === 13) {
                return true
              }
              if (e.charCode === 13) {
                inputClearRef.current?.()
                addMessage(215125215)
              }
            }}
            rightButtons={
              <Button text="Submit" onClick={() => addMessage(125125125)} />
            }
          />
        </InputContainer>
      </ChatViewContainer>
    </MainContainer>
  )
}

export default MainChatApp
