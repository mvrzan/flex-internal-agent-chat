import React from 'react';
import { Text } from '@twilio-paste/text';
import { Stack } from '@twilio-paste/core/stack';
import { FilteredConversation, SelectedAgent } from '../../utils/types';
import AgentCard from './AgentCard';

interface PinnedChatsProps {
  pinnedChats: FilteredConversation[] | undefined;
  selectedAgent: SelectedAgent;
  setIsAgentSelected: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedAgent: React.Dispatch<React.SetStateAction<SelectedAgent>>;
}

const PinnedChats = ({
  pinnedChats,
  selectedAgent,
  setIsAgentSelected,
  setSelectedAgent,
}: PinnedChatsProps) => (
  <Stack orientation="vertical" spacing="space20">
    {pinnedChats?.length !== 0 && (
      <Text as="span" fontSize="fontSize20" fontWeight="fontWeightSemibold">
        Pinned chats
      </Text>
    )}
    {pinnedChats?.map(chat => (
      <AgentCard
        key={chat.uniqueName}
        fullName={chat.fullName}
        firstName={chat.firstName}
        lastName={chat.lastName}
        imageUrl={chat.imageUrl}
        activityName={chat.activityName}
        email={chat.email}
        contactUri={chat.contactUri}
        selectedAgent={selectedAgent}
        setIsAgentSelected={setIsAgentSelected}
        setSelectedAgent={setSelectedAgent}
        pinnedChat={chat}
      />
    ))}
  </Stack>
);

export default PinnedChats;
