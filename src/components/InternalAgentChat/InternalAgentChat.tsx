import { useEffect, useState } from 'react';
import { Heading, Stack } from '@twilio-paste/core';
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

  console.log(agents);

  // TODO: Fix agent:any type
  return (
    <>
      <Heading as="h1" variant="heading10" marginBottom="space0">
        Internal Agent Chat
      </Heading>
      <Stack orientation="vertical" spacing="space30">
        {agents.map((agent: any) => (
          <AgentCard
            agentName={agent.fullName}
            imageUrl={agent.imageUrl}
            key={agent.workerSid}
          />
        ))}
      </Stack>
    </>
  );
};

export default InternalAgentChat;
