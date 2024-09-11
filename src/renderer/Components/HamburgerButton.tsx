import React from 'react'
import styled from '@emotion/styled'

// important constants
const BAR_WIDTH = '3'
const OG_TRANSLATE = '-3px'
const TRANSITION_LENGTH = '.1s'

const HamburgerButtonContainer = styled.button<{ isOpen: boolean }>`
  width: 24px;
  height: 24px;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 0;

  // Transition below
  transition: ${TRANSITION_LENGTH};
  transform: translate(${OG_TRANSLATE}, 0);

  & svg {
    fill: #888;
  }

  &:hover {
    /* Animation to transform the hamburger into an 'X' on hover */
    transform: translate(0, 0);
    & svg {
      fill: #333;
    }
  }

  svg {
    width: 24px;
    height: 24px;
  }
`

const HamburgerIcon = styled.svg`
  width: 24px;
  height: 24px;
`

interface HamburgerButtonProps {
  isOpen: boolean
  toggleSidebar: () => void
}

const HamburgerButton: React.FC<HamburgerButtonProps> = ({
  isOpen,
  toggleSidebar,
}) => {
  return (
    <HamburgerButtonContainer onClick={toggleSidebar} isOpen={isOpen}>
      <HamburgerIcon viewBox="0 0 24 24">
        <rect width="24" height={BAR_WIDTH} />
        <rect y="10" width="24" height={BAR_WIDTH} />
        <rect y="20" width="24" height={BAR_WIDTH} />
      </HamburgerIcon>
    </HamburgerButtonContainer>
  )
}

export default HamburgerButton
