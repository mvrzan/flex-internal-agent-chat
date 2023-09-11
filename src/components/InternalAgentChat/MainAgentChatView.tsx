import * as FlexManager from '@twilio/flex-ui';
import { Conversation } from '@twilio/conversations';
import { ChangeEvent, useEffect, useState } from 'react';
import {
  Heading,
  Stack,
  Flex,
  Separator,
  Box,
  Input,
} from '@twilio-paste/core';
import { SearchIcon } from '@twilio-paste/icons/esm/SearchIcon';
import AgentCard from './AgentCard';
import PinnedChats from './PinnedChats';
import ChatInterface from './ChatInterface';
import LandingScreen from './LandingScreen';
import SelectedAgentView from './SelectedAgentView';
import { WorkerData, SelectedAgent } from '../utils/types';
import getWorkers from '../utils/instantQueryUtil';
import { readFromLocalStorage } from '../utils/localStorageUtil';
import { useLiveQueryClient } from '../utils/useLiveQueryNewClient';

const MainAgentChatView = () => {
  const [selectedAgent, setSelectedAgent] = useState<SelectedAgent>(Object);
  const [isAgentSelected, setIsAgentSelected] = useState<boolean>(false);
  const [pinnedChats, setPinnedChats] = useState<string[]>();
  const [pinnedConversations, setPinnedConversations] =
    useState<Conversation[]>();
  const conversationClient =
    FlexManager.Manager.getInstance().conversationsClient;
  const [workerData, setWorkerName] = useLiveQueryClient();

  useEffect(() => {
    const getPinnedChats = async () => {
      const pinnedChatsFromLocalStorage: string[] = JSON.parse(
        readFromLocalStorage('PinnedChats') as string
      );

      if (pinnedChatsFromLocalStorage === null) return;

      const filteredPinnedChats = pinnedChatsFromLocalStorage.map(
        async (pinnedChat: string) => {
          const fetchedConversation =
            await conversationClient.getConversationByUniqueName(pinnedChat);

          const participants = [...fetchedConversation._participants].map(
            participant => participant[1].identity
          );

          const [queryResponse] = await getWorkers(
            `data.attributes.contact_uri CONTAINS "${participants[0]}"`
          );

          const formatConversationData = {
            ...queryResponse,
            uniqueName: fetchedConversation.uniqueName,
            participant: participants[0],
          };

          return formatConversationData;
        }
      );

      const awaitedFilteredPinnedChats = await Promise.all(filteredPinnedChats);

      // @ts-ignore
      setPinnedConversations(awaitedFilteredPinnedChats);
    };
    getPinnedChats();
  }, [pinnedChats]);

  const inputHandler = async (event: ChangeEvent<HTMLInputElement>) => {
    setWorkerName(event.target.value);
  };

  return (
    <Box
      width="100%"
      overflow="auto"
      padding="space60"
      borderStyle="solid"
      backgroundColor="colorBackgroundBody"
      paddingBottom="space0"
    >
      <Heading as="h1" variant="heading10" marginBottom="space0">
        Internal Agent Chat
      </Heading>
      <Separator orientation="horizontal" verticalSpacing="space50" />
      <Flex
        vAlignContent="top"
        hAlignContent="left"
        height="100%"
        maxHeight="90%"
        marginBottom="space0"
        paddingBottom="space0"
      >
        <PinnedChats
          pinnedConversations={pinnedConversations}
          setIsAgentSelected={setIsAgentSelected}
          setSelectedAgent={setSelectedAgent}
        />
        <Stack orientation="vertical" spacing="space10">
          <Box marginBottom="space40" width="250px">
            <Input
              type="text"
              placeholder="Search for agents..."
              insertBefore={<SearchIcon decorative />}
              onChange={inputHandler}
            />
          </Box>
          {workerData?.map((agent: WorkerData) => (
            <AgentCard
              key={agent.workerSid}
              fullName={agent.fullName}
              firstName={agent.firstName}
              lastName={agent.lastName}
              imageUrl={agent.imageUrl}
              activityName={agent.activityName}
              email={agent.email}
              contactUri={agent.contactUri}
              setIsAgentSelected={setIsAgentSelected}
              setSelectedAgent={setSelectedAgent}
              selectedAgent={selectedAgent}
            />
          ))}
        </Stack>
        {!isAgentSelected ? (
          <LandingScreen />
        ) : (
          <Box
            padding="space80"
            paddingBottom="space0"
            width="100%"
            height="100%"
            margin="space40"
            marginBottom="space0"
            marginTop="space0"
            borderRadius="borderRadius30"
            backgroundColor="colorBackgroundPrimaryWeakest"
          >
            <SelectedAgentView
              selectedAgent={selectedAgent}
              setPinnedChats={setPinnedChats}
            />
            <Separator orientation="horizontal" verticalSpacing="space50" />
            <Flex vAlignContent="bottom" height="90%" paddingBottom="space40">
              <ChatInterface selectedAgent={selectedAgent} />
            </Flex>
          </Box>
        )}
      </Flex>
    </Box>
  );
};

export default MainAgentChatView;
