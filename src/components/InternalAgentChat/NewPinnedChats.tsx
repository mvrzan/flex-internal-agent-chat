import { Text, Stack } from '@twilio-paste/core';
import { FilteredWorkerInfo, SelectedAgent } from '../utils/types';
import AgentCard from './AgentCard';

interface NewPinnedChatsProps {
  pinnedChats: FilteredWorkerInfo[] | undefined;
  selectedAgent: SelectedAgent;
  setIsAgentSelected: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedAgent: React.Dispatch<React.SetStateAction<SelectedAgent>>;
}

const NewPinnedChats = ({
  pinnedChats,
  selectedAgent,
  setIsAgentSelected,
  setSelectedAgent,
}: NewPinnedChatsProps) => {
  return (
    <Stack orientation="vertical" spacing="space20">
      {pinnedChats?.length !== 0 && (
        <Text as="span" fontSize="fontSize20" fontWeight="fontWeightSemibold">
          Pinned chats
        </Text>
      )}
      {pinnedChats?.map(chat => {
        return (
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
        );
      })}
    </Stack>
  );
};

export default NewPinnedChats;
