import { Heading, Stack } from '@twilio-paste/core';
import instantQuerySearch from '../utils/instantQuerySearch';
import { useEffect, useState } from 'react';

const InternalAgentChat = () => {
  const [agents, setAgents] = useState([]);
  useEffect(() => {
    const getAgents = async () => {
      const data = await instantQuerySearch(
        'tr-worker',
        `${'' !== '' ? '' : ''}`
      );
      setAgents(data);
    };
    getAgents();
  }, []);

  console.log(agents);
  return (
    <>
      <Heading as="h1" variant="heading10" marginBottom="space0">
        Internal Agent Chat
      </Heading>
      <Stack orientation="vertical" spacing="space30"></Stack>
    </>
  );
};

export default InternalAgentChat;
