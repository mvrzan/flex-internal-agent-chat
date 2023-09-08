import { ChangeEvent, useEffect, useState } from 'react';
import {
  Heading,
  Stack,
  Flex,
  Separator,
  Box,
  Input,
} from '@twilio-paste/core';
import AgentCard from './AgentCard';
import { SearchIcon } from '@twilio-paste/icons/esm/SearchIcon';
import SelectedAgentView from './SelectedAgentView';
import ChatInterface from './ChatInterface';
import LandingScreen from './LandingScreen';
import { liveQuerySearch } from '../utils/liveQuerySearch';
import { LiveQuery } from 'twilio-sync/lib/livequery';
import { WorkerData, SelectedAgent } from '../utils/types';
import PinnedChats from './PinnedChats';
import { readFromLocalStorage } from '../utils/localStorageUtil';
import { Conversation } from '@twilio/conversations';
import * as FlexManager from '@twilio/flex-ui';
import getWorkers from '../utils/instantQueryUtil';

const InternalAgentChat = () => {
  const [agents, setAgents] = useState<WorkerData[] | undefined>([]);
  const [selectedAgent, setSelectedAgent] = useState<SelectedAgent>(Object);
  const [isAgentSelected, setIsAgentSelected] = useState<boolean>(false);
  const [pinnedChats, setPinnedChats] = useState<string[]>();
  const [pinnedConversations, setPinnedConversations] =
    useState<Conversation[]>();
  const conversationClient =
    FlexManager.Manager.getInstance().conversationsClient;

  useEffect(() => {
    const getLiveQueryClient = getAgents();
    const useLiveQueryClient = async () => {
      const liveQueryClient = await getLiveQueryClient;
      liveQueryClient?.on('itemUpdated', args => {
        const updatedWorkerData = {
          firstName: args.value.attributes.full_name.split(' ')[0],
          lastName: args.value.attributes.full_name.split(' ')[1],
          contactUri: args.value.attributes.contact_uri.split(':')[1],
          fullName: args.value.attributes.full_name,
          imageUrl: args.value.attributes.image_url,
          value: args.value.attributes.contact_uri,
          workerSid: args.value.worker_sid,
          email: args.value.attributes.email,
          activityName: args.value.activity_name,
        };

        setAgents((prevWorkerData: WorkerData[] | undefined) => {
          if (prevWorkerData !== undefined) {
            const newWorkerData = prevWorkerData?.map(
              (workerData: WorkerData) => {
                if (workerData.contactUri === updatedWorkerData.contactUri) {
                  workerData.activityName = updatedWorkerData.activityName;
                }
                return workerData;
              }
            );
            return newWorkerData;
          }
        });
      });
    };
    useLiveQueryClient();

    return () => {
      const disconnectLiveQueryClient = async () => {
        const liveQueryClient: LiveQuery | undefined = await getLiveQueryClient;
        liveQueryClient?.close();
        console.log('Disconnecting liveQueryClient!');
      };
      disconnectLiveQueryClient();
    };
  }, [selectedAgent]);

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

  const getAgents = async (
    query: string = ''
  ): Promise<LiveQuery | undefined> => {
    try {
      const [liveQueryClient, workerData] = await liveQuerySearch(
        'tr-worker',
        `${query !== '' ? `${query}` : ''}`
      );

      setAgents(workerData);

      return liveQueryClient;
    } catch (error) {
      console.log('ERROR', error);
    }
  };

  const inputHandler = (event: ChangeEvent<HTMLInputElement>) => {
    getAgents(`data.attributes.full_name CONTAINS "${event.target.value}"`);
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
          {agents?.map((agent: WorkerData) => (
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

export default InternalAgentChat;
