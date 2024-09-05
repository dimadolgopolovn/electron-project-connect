import styled from '@emotion/styled';
import React from 'react';

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
  backgroundColor: props.isSelected ? '#486993' : '#1a222c', // Highlight selected chat
  borderBottom: '1px solid #252F3F',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: '#f0f0f0', // Light hover effect
  },
}));

// Avatar or icon placeholder
const StyledAvatar = styled.div<{ photoBase64: string | undefined }>`
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #ccc; /* Placeholder color */
  margin-right: 10px;
  background-image: ${(props) =>
    props.photoBase64
      ? `url(data:image/jpeg;base64,${props.photoBase64})`
      : 'none'};
  background-size: cover;
`;

const Loader = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  border: 2px solid #fff;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s infinite linear;

  @keyframes spin {
    0% {
      transform: translate(-50%, -50%) rotate(0deg);
    }
    100% {
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }
`;

const AvatarContainer = styled.div`
  position: relative;
`;

export const AvatarComponent: React.FC<{
  photoBase64: Promise<string | undefined>;
}> = ({ photoBase64 }) => {
  const [resolvedPhoto, setResolvedPhoto] = React.useState<string | undefined>(
    undefined,
  );
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    photoBase64.then((result) => {
      setResolvedPhoto(result); // Store the resolved base64 image
      setIsLoading(false);
    });
  }, [photoBase64]);

  return (
    <AvatarContainer>
      <StyledAvatar photoBase64={resolvedPhoto} />
      {isLoading && <Loader />}
    </AvatarContainer>
  );
};

// Container for text (title and subtitle)
const TextContainer = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
}));

// Title of the chat
const Title = styled.div(() => ({
  fontWeight: 'semibold',
  fontSize: '16px',
  color: '#fff',
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

export const DialogTile: React.FC<
  DialogTileProps & {
    photoBase64: Promise<string | undefined>;
    title: string;
    subtitle: string;
    unreadCount: number;
    isSelected: boolean;
    onSelect: () => void;
  }
> = ({ photoBase64, title, subtitle, unreadCount, isSelected, onSelect }) => {
  return (
    <DialogTileContainer isSelected={isSelected} onClick={onSelect}>
      {<AvatarComponent photoBase64={photoBase64} />}
      <TextContainer>
        <Title>{title}</Title>
        <Subtitle>{subtitle}</Subtitle>
      </TextContainer>
      {unreadCount > 0 && <UnreadCount>{unreadCount}</UnreadCount>}
    </DialogTileContainer>
  );
};
