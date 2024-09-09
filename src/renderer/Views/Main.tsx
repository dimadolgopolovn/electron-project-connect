import React, { useRef } from 'react'
import styled from '@emotion/styled'
import ChatList from '../Components/ChatList'
import MessageList from '../Components/MessageList'
import { Button, Input } from 'react-chat-elements'

// I tried using https://github.com/bvaughn/react-resizable-panels from _shadcn_ but they don't support px default width.
// I tried implementing it but it proved to be too complicated, so I went for this library instead.
// https://github.com/tomkp/react-split-pane doesn't work at all. It's too buggy.
import { Allotment } from 'allotment'
import 'allotment/dist/style.css'
// TODO Dima: Types are wrong. Allotment.Pane.maxSize supports strings too. Same with defaultSizes

// Styled Components
const MainContainer = styled.div`
  display: flex;
  height: 100vh;
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
  const inputRef = useRef(null)
  const inputClearRef = useRef<Function | null>(null)

  const addMessage = (data: number) => {}

  return (
    <MainContainer>
      {/* Sizes are in px. DefaultSizes are scaled to ratio */}
      <Allotment proportionalLayout={false}>
        <Allotment.Pane
          minSize={250}
          maxSize={Infinity}
          preferredSize={'250px'}
        >
          <ChatList />
        </Allotment.Pane>
        <Allotment.Pane>
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
        </Allotment.Pane>
      </Allotment>
    </MainContainer>
  )
}

export default MainChatApp
