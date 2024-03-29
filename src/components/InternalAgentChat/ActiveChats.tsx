import React from 'react';

import { Stack } from '@twilio-paste/core/stack';
import { Text } from '@twilio-paste/core/text';
import AgentCard from './AgentCard';
import { SelectedAgent, FilteredConversation } from '../../utils/types';

interface ActiveChatsProps {
  selectedAgent: SelectedAgent;
  setIsAgentSelected: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedAgent: React.Dispatch<React.SetStateAction<SelectedAgent>>;
  activeConversations: FilteredConversation[] | undefined;
}

const ActiveChats = ({
  selectedAgent,
  setIsAgentSelected,
  setSelectedAgent,
  activeConversations,
}: ActiveChatsProps) => {
  return (
    <Stack orientation="vertical" spacing="space20">
      {activeConversations?.length !== 0 && (
        <Text as="span" fontSize="fontSize20" fontWeight="fontWeightSemibold">
          Active chats
        </Text>
      )}
      {activeConversations?.map(conversation => (
        <AgentCard
          key={conversation.uniqueName}
          fullName={conversation.fullName}
          firstName={conversation.firstName}
          lastName={conversation.lastName}
          imageUrl={conversation.imageUrl}
          email={conversation.email}
          contactUri={conversation.contactUri}
          selectedAgent={selectedAgent}
          setIsAgentSelected={setIsAgentSelected}
          setSelectedAgent={setSelectedAgent}
          pinnedChat={conversation}
        />
      ))}
    </Stack>
  );
};

export default ActiveChats;
