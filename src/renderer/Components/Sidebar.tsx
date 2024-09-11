import React, { useRef, useState } from 'react'
import styled from '@emotion/styled'

const MARGIN_FOR_ERROR = '5px' // we give a few empty pixels before sidebar autofades on mouseleave
const SIDEBAR_WIDTH = '250px'

const ComponentWrapper = styled.div<{ isOpen: boolean }>`
  // Add this line to create a 3px padding on the right when open
  position: fixed;
  width: ${({ isOpen }) =>
    isOpen ? `calc(${SIDEBAR_WIDTH} + ${MARGIN_FOR_ERROR})` : '0px'};
  height: 100%;

  z-index: 50; // Split bar (the one that you can pull to resize windows) is z-index 35. This number has to be higher.
`

const SidebarContainer = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: ${({ isOpen }) => (isOpen ? '0' : '-' + SIDEBAR_WIDTH)};
  height: 100%;
  width: ${SIDEBAR_WIDTH};
  background-color: #1e1e1e;
  transition:
    left 0.1s ease-out,
    opacity 0.05s ease-out;

  opacity: ${({ isOpen }) => (isOpen ? '1' : '0')};
  box-shadow: ${({ isOpen }) =>
    isOpen ? '2px 0px 10px rgba(0, 0, 0, 0.5)' : 'none'};
`

const SidebarTrigger = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 2px;
  height: 100%;
  z-index: 9;
`

interface SidebarProps {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const sidebarRef = useRef<HTMLDivElement>(null)

  const handleSidebarTriggerMouseEnter = () => {
    if (!isOpen) {
      setIsOpen(true)
    }
  }

  const handleSidebarTriggerMouseLeave = (e: React.MouseEvent) => {
    if (
      isOpen && // keeping it here because it might solve some bugs in the future.
      sidebarRef.current &&
      e.relatedTarget instanceof Node &&
      !sidebarRef.current.contains(e.relatedTarget)
    ) {
      // Check if relatedTarget is NOT a child of the sidebar)
      setIsOpen(false)
    }
  }

  return (
    <>
      <ComponentWrapper
        ref={sidebarRef}
        isOpen={isOpen}
        onMouseLeave={handleSidebarTriggerMouseLeave}
      >
        <SidebarTrigger onMouseEnter={handleSidebarTriggerMouseEnter} />
        <SidebarContainer isOpen={isOpen}>
          {/* Sidebar content */}
        </SidebarContainer>
      </ComponentWrapper>
    </>
  )
}

export default Sidebar
