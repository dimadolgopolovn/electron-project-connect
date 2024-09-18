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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '../ShadcnComponents/Dialog'
import { TelegramLogin } from '../features/auth/telegram/TelegramLogin'
import { WhatsappLogin } from '../features/auth/whatsapp/WhatsappLogin'
import { useChatModules } from '../Contexts/ChatModulesContext'
import { useDialogs } from '../Hooks/useDialogs'
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

const CHATVIEW_MARGIN_BOTTOM = '16px'
const ChatViewContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  margin-bottom: ${CHATVIEW_MARGIN_BOTTOM};

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

const CustomAllotment = styled(Allotment)`
  & .sash {
    // without this sash (the split drag components goes to the bottom of the screen, when the visible div has margin)
    height: calc(
      100% - ${CHATVIEW_MARGIN_BOTTOM}
    ); // we can even compensate for round corners in the future and make it a few px shorter
  }
`

const CustomDialogContent = styled(DialogContent)`
  width: 300px;
  height: 90%;
  position: fixed;
  display: flex;
  flex-direction: column;

  /* center */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  background-color: #999;

  z-index: 100;
`

const MainChatApp: React.FC = () => {
  // component
  const inputRef = useRef(null)
  const inputClearRef = useRef<Function | null>(null)

  // chats and api
  const { telegramModule, whatsappModule } = useChatModules()
  const {
    dialogsList,
    isLoading: isDialogsLoading,
    // we could add loadDialogs here too
    error: dialogsError,
  } = useDialogs({
    limit: 10,
    ignorePinned: false,
    archived: false,
  })
  const [selectedChatIndex, setSelectedChatIndex] = useState(-1)

  // sidebars and modules
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const showSettings = () => {
    setIsSettingsOpen(true)
  }

  const addMessage = (data: number) => {
    // here we empty the input, and do out thing. I'll implement it when we connect to the APIs.
  }

  return (
    <>
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen}>
        <button onClick={showSettings}>Settings</button>
      </Sidebar>
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <CustomDialogContent>
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>
              Adjust your application settings here.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto">
            <h3>Telegram</h3>
            {telegramModule && (
              <TelegramLogin authRepository={telegramModule.authRepository} />
            )}
            <br />
            <h3>WhatsApp</h3>
            {whatsappModule && <WhatsappLogin module={whatsappModule} />}
          </div>
          <DialogFooter className="sm:justify-end">
            <DialogClose asChild>
              <button type="button">Close</button>
            </DialogClose>
          </DialogFooter>
        </CustomDialogContent>
      </Dialog>
      <MainContainer>
        <Header>
          <HamburgerButton
            isOpen={isSidebarOpen}
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />
        </Header>
        {/* Sizes are in px. DefaultSizes are scaled to ratio */}
        <CustomAllotment proportionalLayout={false} separator={false}>
          <Allotment.Pane
            minSize={250}
            maxSize={Infinity}
            preferredSize={'300px'}
          >
            <ChatList chatList={dialogsList} />
          </Allotment.Pane>
          <Allotment.Pane>
            <ChatViewPaneContainer>
              <ChatViewContainer>
                <MessageListContainer>
                  <MessageList dialogEntity={dialogsList[selectedChatIndex]} />
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
        </CustomAllotment>
      </MainContainer>
    </>
  )
}

export default MainChatApp
