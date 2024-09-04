import React, { useState } from 'react'
import styled from '@emotion/styled'
import ChatSidebar from '../Components/ListOfChats'
import ChatApp from '../Components/ChatView'

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
  flex-grow: 1; // fill width
  height: 100%;
`

const MainChatApp: React.FC = () => {
  const [sidebarWidth, setSidebarWidth] = useState(300)

  return (
    <MainContainer>
      <ResizableSidebar
        width={sidebarWidth}
        onMouseUp={(e) => setSidebarWidth(e.currentTarget.clientWidth)}
      >
        <ChatSidebar />
      </ResizableSidebar>
      <ChatViewContainer>
        <ChatApp />
      </ChatViewContainer>
    </MainContainer>
  )
}

export default MainChatApp
