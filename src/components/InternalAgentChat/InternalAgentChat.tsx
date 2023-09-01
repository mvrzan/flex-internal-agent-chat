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
import liveQuerySearch from '../utils/liveQuerySearch';
import { LiveQuery } from 'twilio-sync/lib/livequery';
import { WorkerData } from '../utils/types';

const InternalAgentChat = () => {
  // TODO: Fix state types
  const [agents, setAgents] = useState<any>([]);
  const [selectedAgent, setSelectedAgent] = useState<any>({});
  const [isAgentSelected, setIsAgentSelected] = useState<boolean>(false);

  useEffect(() => {
    const getLiveQueryClient = getAgents();

    return () => {
      const disconnectLiveQueryClient = async () => {
        const liveQueryClient: LiveQuery | undefined = await getLiveQueryClient;
        liveQueryClient?.close();
        console.log('Disconnecting liveQueryClient!');
      };
      disconnectLiveQueryClient();
    };
  }, []);

  const getAgents = async (
    query: string = ''
  ): Promise<LiveQuery | undefined> => {
    try {
      const [liveQueryClient, workerData] = await liveQuerySearch(
        'tr-worker',
        `${query !== '' ? `${query}` : ''}`
      );

      setAgents(workerData);
      //@ts-ignore
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
        <Stack orientation="vertical" spacing="space10">
          <Box marginBottom="space40" width="250px">
            <Input
              type="text"
              placeholder="Search for agents..."
              insertBefore={<SearchIcon decorative />}
              onChange={inputHandler}
            />
          </Box>
          {agents.map((agent: WorkerData) => (
            <AgentCard
              key={agent.workerSid}
              fullName={agent.fullName}
              firstName={agent.firstName}
              lastName={agent.lastName}
              imageUrl={agent.imageUrl}
              activityName={agent.activityName}
              email={agent.email}
              contactUri={agent.contactUri}
              isAgentSelected={isAgentSelected}
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
            <SelectedAgentView selectedAgent={selectedAgent} />
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
