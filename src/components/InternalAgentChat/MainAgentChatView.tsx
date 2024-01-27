import React, { useState } from 'react';
import { ViewProps } from '@twilio/flex-ui';
import { Heading, Stack, Flex, Separator, Box } from '@twilio-paste/core';
import ActiveChats from './ActiveChats';
import AgentSearch from './AgentSearch';
import PinnedChats from './PinnedChats';
import ChatInterface from './ChatInterface';
import LandingScreen from './LandingScreen';
import SelectedAgentView from './SelectedAgentView';
import { SelectedAgent } from '../../utils/types';
import useConversations from '../../hooks/useConversations';

const MainAgentChatView = ({
  route: {
    location: { pathname },
  },
}: ViewProps) => {
  const [selectedAgent, setSelectedAgent] = useState<SelectedAgent>(Object);
  const [isAgentSelected, setIsAgentSelected] = useState<boolean>(false);
  const [newPinnedChats, setNewPinnedChats] = useState<string[]>();
  const [pinnedChatState, setPinnedChatState] = useState<boolean>(false);
  const [conversations, pinnedConversations] = useConversations(
    pathname,
    newPinnedChats,
    pinnedChatState,
    selectedAgent.contactUri
  );

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
        <Stack orientation="vertical" spacing="space20">
          <Box marginBottom="space40" width="260px">
            <AgentSearch
              setIsAgentSelected={setIsAgentSelected}
              setSelectedAgent={setSelectedAgent}
            />
          </Box>
          <PinnedChats
            pinnedChats={pinnedConversations}
            setIsAgentSelected={setIsAgentSelected}
            setSelectedAgent={setSelectedAgent}
            selectedAgent={selectedAgent}
          />
          <ActiveChats
            setIsAgentSelected={setIsAgentSelected}
            setSelectedAgent={setSelectedAgent}
            selectedAgent={selectedAgent}
            activeConversations={conversations}
          />
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
              pinnedChatState={pinnedChatState}
              setPinnedChatState={setPinnedChatState}
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
