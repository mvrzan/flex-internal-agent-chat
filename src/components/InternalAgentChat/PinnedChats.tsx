import { Button, Flex, Avatar, Tooltip, Stack } from '@twilio-paste/core';

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
      minWidth="fit-content"
      padding="space10"
    >
      <Stack orientation="vertical" spacing="space10">
        {pinnedConversations?.map((conversation: any) => (
          <Button
            variant="secondary"
            fullWidth
            onClick={() => {
              console.log('click');
            }}
            key={conversation.uniqueName}
            element="BUTTON_PINNED_CHATS"
          >
            <Tooltip text={conversation.participantFullName}>
              <Avatar
                name={conversation.participant}
                src={conversation.imageUrl}
              />
            </Tooltip>
          </Button>
        ))}
      </Stack>
    </Flex>
  );
};

export default PinnedChats;
