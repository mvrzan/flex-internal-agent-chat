import { Button, Flex, Avatar, Tooltip, Stack } from '@twilio-paste/core';
import { SelectedAgent } from '../utils/types';

interface PinnedChatsProps {
  pinnedConversations: any;
  setIsAgentSelected: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedAgent: React.Dispatch<React.SetStateAction<SelectedAgent>>;
}

const PinnedChats = ({
  pinnedConversations,
  setIsAgentSelected,
  setSelectedAgent,
}: PinnedChatsProps) => {
  const openPinnedChatHandler = (conversation: any) => {
    setIsAgentSelected(true);
    setSelectedAgent(conversation);
  };

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
              openPinnedChatHandler(conversation);
            }}
            key={conversation.uniqueName}
            element="BUTTON_PINNED_CHATS"
          >
            <Tooltip text={conversation.fullName}>
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
