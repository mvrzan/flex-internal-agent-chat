import { useEffect, useState } from 'react';
import { Heading, Stack, Flex, Separator, Box } from '@twilio-paste/core';
import getWorkers from '../utils/instantQuerySearch';
import AgentCard from './AgentCard';

const InternalAgentChat = () => {
  const [agents, setAgents] = useState<any>([]);
  useEffect(() => {
    const getAgents = async () => {
      const data = await getWorkers();
      setAgents(data);
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
      </Flex>
    </Box>
  );
};

export default InternalAgentChat;
