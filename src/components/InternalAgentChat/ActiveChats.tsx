import { Text, Stack } from '@twilio-paste/core';
import AgentCard from './AgentCard';
import useSubscribedConversations from '../../utils/useSubscribedConversations';
import { FilteredWorkerInfo, SelectedAgent } from '../../utils/types';

interface ActiveChatsProps {
  activeView: string;
  pinnedChats: FilteredWorkerInfo[] | undefined;
  selectedAgent: SelectedAgent;
  setIsAgentSelected: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedAgent: React.Dispatch<React.SetStateAction<SelectedAgent>>;
}

const ActiveChats = ({
  activeView,
  pinnedChats,
  selectedAgent,
  setIsAgentSelected,
  setSelectedAgent,
}: ActiveChatsProps) => {
  const activeConversations = useSubscribedConversations(activeView);

  return (
    <Stack orientation="vertical" spacing="space20">
      {activeConversations?.length !== 0 && (
        <Text as="span" fontSize="fontSize20" fontWeight="fontWeightSemibold">
          Active chats
        </Text>
      )}
      {activeConversations?.map((conversation: any) => (
        <AgentCard
          key={conversation.uniqueName}
          fullName={conversation.fullName}
          firstName={conversation.firstName}
          lastName={conversation.lastName}
          imageUrl={conversation.imageUrl}
          activityName={conversation.activityName}
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
