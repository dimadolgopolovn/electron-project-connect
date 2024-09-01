import styled from '@emotion/styled';

interface DialogTileProps {
  chatId: string;
  title: string;
  subtitle: string;
  unreadCount: number;
  isSelected: boolean;
  onSelect: () => void;
}

// Container for each chat tile
const DialogTileContainer = styled.div<{ isSelected: boolean }>((props) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  padding: '10px',
  backgroundColor: props.isSelected ? '#e0e0e0' : '#fff', // Highlight selected chat
  borderBottom: '1px solid #ccc',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: '#f0f0f0', // Light hover effect
  },
}));

// Avatar or icon placeholder
const Avatar = styled.div(() => ({
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  backgroundColor: '#ccc', // Placeholder color
  marginRight: '10px',
}));

// Container for text (title and subtitle)
const TextContainer = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
}));

// Title of the chat
const Title = styled.div(() => ({
  fontWeight: 'bold',
  fontSize: '16px',
  color: '#333',
}));

// Subtitle or last message preview
const Subtitle = styled.div(() => ({
  fontSize: '14px',
  color: '#777',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}));

// Unread message count bubble
const UnreadCount = styled.div((props) => ({
  backgroundColor: '#ff5722',
  color: '#fff',
  borderRadius: '12px',
  padding: '2px 8px',
  fontSize: '12px',
  minWidth: '24px',
  textAlign: 'center',
}));

export const DialogTile: React.FC<DialogTileProps> = ({
  chatId,
  title,
  subtitle,
  unreadCount,
  isSelected,
  onSelect,
}) => {
  return (
    <DialogTileContainer isSelected={isSelected} onClick={onSelect}>
      <Avatar />
      <TextContainer>
        <Title>{title}</Title>
        <Subtitle>{subtitle}</Subtitle>
      </TextContainer>
      {unreadCount > 0 && <UnreadCount>{unreadCount}</UnreadCount>}
    </DialogTileContainer>
  );
};
