import React, { useRef, useState } from 'react'
import styled from '@emotion/styled'
import ChatList from '../Components/ChatList'
import MessageList from '../Components/MessageList'
import { Button, Input } from 'react-chat-elements'
import Sidebar from '../Components/Sidebar'

// I tried using https://github.com/bvaughn/react-resizable-panels from _shadcn_ but they don't support px default width.
// I tried implementing it but it proved to be too complicated, so I went for this library instead.
// https://github.com/tomkp/react-split-pane doesn't work at all. It's too buggy.
import { Allotment } from 'allotment'
import 'allotment/dist/style.css'
import HamburgerButton from '../Components/HamburgerButton'
// TODO Dima: Types are wrong. Allotment.Pane.maxSize supports strings too. Same with defaultSizes

const MAIN_BACKGROUND_COLOR = '#08090A'
const MESSAGE_LIST_BACKGROUND_COLOR = '#101011'
const MESSAGE_LIST_BORDER_COLOR = '#25282d'
const INPUT_BACKGROUND_COLOR = '#16181A'

// Styled Components

const Header = styled.div`
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
`

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: ${MAIN_BACKGROUND_COLOR};
`

const ChatViewPaneContainer = styled.div`
  flex-grow: 1;
  height: 100%;
  display: flex;
  flex-direction: column;

  margin-right: 16px; // needed to create the right paddings everywhere
`

const ChatViewContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  margin-bottom: 16px;

  background-color: ${MESSAGE_LIST_BACKGROUND_COLOR};
  border: 0.5px ${MESSAGE_LIST_BORDER_COLOR} solid;
  border-radius: 5px;

  overflow: hidden;
`

const MessageListContainer = styled.div`
  flex-grow: 1;
  overflow: auto;
`

const CustomInput = styled(Input)`
  border-top: 1px solid ${MESSAGE_LIST_BORDER_COLOR};
  background-color: ${INPUT_BACKGROUND_COLOR};
  border-radius: 0;

  height: 48px;

  // THE ACTUAL INPUT FIELD
  & .rce-input.rce-input-textarea {
    border-radius: 0;
    background-color: transparent;

    font-family: Arial, Helvetica, sans-serif;

    color: #eaeaea;

    padding-left: 20px; // 20 + 38 + 10 from MessageList margins to align with text once we add buttons for location, etc
    padding-right: 20px;
  }

  // SEND BUTTON (conceal for now)
  & .rce-button,
  & .rce-input-buttons {
    display: none;
  }
`

const MainChatApp: React.FC = () => {
  const inputRef = useRef(null)
  const inputClearRef = useRef<Function | null>(null)

  const addMessage = (data: number) => {
    // here we empty the input, and do out thing. I'll implement it when we connect to the APIs.
  }

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <>
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <MainContainer>
        <Header>
          <HamburgerButton
            isOpen={isSidebarOpen}
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />
        </Header>
        {/* Sizes are in px. DefaultSizes are scaled to ratio */}
        <Allotment proportionalLayout={false} separator={false}>
          <Allotment.Pane
            minSize={250}
            maxSize={Infinity}
            preferredSize={'300px'}
          >
            <ChatList />
          </Allotment.Pane>
          <Allotment.Pane>
            <ChatViewPaneContainer>
              <ChatViewContainer>
                <MessageListContainer>
                  <MessageList />
                </MessageListContainer>
                <CustomInput
                  placeholder="Press Enter to start typing"
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
                    <Button
                      text="Submit"
                      onClick={() => addMessage(125125125)}
                    />
                  }
                />
              </ChatViewContainer>
            </ChatViewPaneContainer>
          </Allotment.Pane>
        </Allotment>
      </MainContainer>
    </>
  )
}

export default MainChatApp
