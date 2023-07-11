import { useEffect, useState } from 'react';
import { Heading, Stack, Flex, Separator, Box } from '@twilio-paste/core';
import getWorkers from '../utils/instantQuerySearch';
import AgentCard from './AgentCard';
import liveQuerySearch from '../utils/liveQuerySearch';

const InternalAgentChat = () => {
  const [agents, setAgents] = useState<any>([]);
  const [agents2, setAgents2] = useState<any>([]);
  useEffect(() => {
    const getAgents = async () => {
      const data = await getWorkers();
      setAgents(data);

      const newAgents = await liveQuerySearch('tr-worker', '');
      setAgents2(newAgents);
    };

    getAgents();
  }, []);

  // TODO: Fix agent:any type
  return (
    <Box
      width="100%"
      overflow="auto"
      padding="space60"
      borderStyle="solid"
      backgroundColor="colorBackgroundBody"
    >
      <Heading as="h1" variant="heading10" marginBottom="space0">
        Internal Agent Chat
      </Heading>
      <Separator orientation="horizontal" verticalSpacing="space50" />
      {/* <Box width="15%" marginRight="space130">
        <Stack orientation="vertical" spacing="space10">
          {agents.map((agent: any) => (
            <AgentCard
              key={agent.workerSid}
              fullName={agent.fullName}
              firstName={agent.firstName}
              lastName={agent.lastName}
              imageUrl={agent.imageUrl}
            />
          ))}
        </Stack>
      </Box> */}
      <Flex vAlignContent="center" hAlignContent="left">
        <Stack orientation="vertical" spacing="space10">
          {agents2.map((agent: any) => (
            <AgentCard
              key={agent.workerSid}
              fullName={agent.fullName}
              firstName={agent.firstName}
              lastName={agent.lastName}
              imageUrl={agent.imageUrl}
              activityName={agent.activityName}
            />
          ))}
        </Stack>
      </Flex>
    </Box>
  );
};

export default InternalAgentChat;
