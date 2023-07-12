import { useEffect, useState } from 'react';
import {
  Heading,
  Stack,
  Flex,
  Separator,
  Box,
  Input,
} from '@twilio-paste/core';
import AgentCard from './AgentCard';
import { Manager } from '@twilio/flex-ui';
import { SearchIcon } from '@twilio-paste/icons/esm/SearchIcon';

const InternalAgentChat = () => {
  // TODO: Fix state types
  const [agents, setAgents] = useState<any>([]);

  useEffect(() => {
    const liveQuerySearch = async (index: string, query: string) => {
      const liveQueryClient =
        await Manager.getInstance().insightsClient.liveQuery(index, query);

      const items = liveQueryClient.getItems();
      const workerdata = Object.values(items).map((worker: any) => {
        return {
          firstName: worker.attributes.full_name.split(' ')[0],
          lastName: worker.attributes.full_name.split(' ')[1],
          fullName: worker.attributes.full_name,
          imageUrl: worker.attributes.image_url,
          value: worker.attributes.contact_uri,
          workerSid: worker.worker_sid,
          email: worker.attributes.email,
          activityName: worker.activity_name,
        };
      });

      liveQueryClient.on('itemRemoved', args => {
        console.log('Worker ' + args.key + ' is no longer "Available"');
      });

      liveQueryClient.on('itemUpdated', args => {
        const updatedWorkerdata = workerdata.map(worker =>
          worker.fullName === args.value.attributes.full_name
            ? { ...worker, activityName: args.value.activity_name }
            : worker
        );
        setAgents(updatedWorkerdata);
      });

      setAgents(workerdata);
      return liveQueryClient;
    };
    const liveQueryClient = liveQuerySearch('tr-worker', '');

    return () => {
      liveQueryClient.then(liveQueryClient => liveQueryClient.close());
    };
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
          <Box marginBottom="space40">
            <Input
              type="text"
              placeholder="Search for agents..."
              insertBefore={<SearchIcon decorative />}
            />
          </Box>
          {agents.map((agent: any) => (
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
