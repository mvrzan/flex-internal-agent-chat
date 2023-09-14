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
import { useLiveQueryClient } from '../utils/useLiveQueryClient';
import usePinnedChats from '../utils/usePinnedChats';
import { Manager } from '@twilio/flex-ui';

const MainAgentChatView = () => {
  const [selectedAgent, setSelectedAgent] = useState<SelectedAgent>(Object);
  const [isAgentSelected, setIsAgentSelected] = useState<boolean>(false);
  const [newPinnedChats, setNewPinnedChats] = useState<string[]>();
  const [workerData, setWorkerName] = useLiveQueryClient();
  const [pinnedChats, setPinnedChats] = usePinnedChats(newPinnedChats);

  const conversationClient = Manager.getInstance().conversationsClient;
  const uniqueName: string = [
    selectedAgent.contactUri,
    conversationClient.user.identity,
  ]
    .sort()
    .join('+');

  useEffect(() => {
    pinnedChats?.forEach((chat: any) => {
      if (chat !== undefined) {
        if (chat.uniqueName === uniqueName) {
          chat.fetchedConversation.setAllMessagesRead();

          setPinnedChats(prevState => {
            if (prevState !== undefined) {
              return prevState.map(prevMessage => {
                return { ...prevMessage, unreadMessages: 0 };
              });
            }
          });

          chat.fetchedConversation.on('messageAdded', async (message: any) => {
            const unreadMessages =
              await chat.fetchedConversation.getUnreadMessagesCount();

            setPinnedChats((prevState: any) => {
              if (prevState !== undefined) {
                // @ts-ignore
                return prevState.map((prevMessage: any) =>
                  prevMessage.uniqueName === message.conversation.uniqueName
                    ? { ...prevMessage, unreadMessages }
                    : prevMessage
                );
              }
            });
          });
        } else {
          chat.fetchedConversation.on('messageAdded', async (message: any) => {
            const unreadMessages =
              await chat.fetchedConversation.getUnreadMessagesCount();

            setPinnedChats((prevState: any) => {
              if (prevState !== undefined) {
                // @ts-ignore
                return prevState.map((prevMessage: any) =>
                  prevMessage.uniqueName === message.conversation.uniqueName
                    ? { ...prevMessage, unreadMessages }
                    : prevMessage
                );
              }
            });
          });
        }
      }
    });
  }, [selectedAgent]);

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
          pinnedConversations={pinnedChats}
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
              setPinnedChats={setNewPinnedChats}
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
