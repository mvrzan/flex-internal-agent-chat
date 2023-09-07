import { Button, Flex, Avatar, Tooltip } from '@twilio-paste/core';

interface PinnedChatsProps {
  pinnedConversations: any;
}

const PinnedChats = ({ pinnedConversations }: PinnedChatsProps) => {
  return (
    <Flex
      vertical
      marginRight="space30"
      hAlignContent="center"
      vAlignContent="top"
      element="FLEX_PINNED_CHATS"
      height="100%"
    >
      {pinnedConversations?.map((conversation: any) => (
        <Button
          variant="secondary"
          fullWidth
          onClick={() => {
            console.log('click');
          }}
          key={conversation.uniqueName}
          element="BUTTON_WITHOUT_BORDERS"
        >
          <Tooltip text={conversation.participantFullName}>
            <Avatar
              name={conversation.participant}
              src={conversation.imageUrl}
            />
          </Tooltip>
        </Button>
      ))}
    </Flex>
  );
};

export default PinnedChats;
