import React, { useState, useEffect } from 'react';

import { Stack } from '@twilio-paste/core/stack';
import { Text } from '@twilio-paste/core/text';
import { Avatar } from '@twilio-paste/core/avatar';
import { Flex } from '@twilio-paste/core/flex';
import { Button } from '@twilio-paste/core/button';
import { Badge } from '@twilio-paste/core/badge';
import { SelectedAgent, FilteredConversation } from '../../utils/types';
import { useLiveQueryClient } from '../../hooks/useLiveQueryClient';

interface AgentCardProps {
  fullName: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
  email: string;
  contactUri: string;
  selectedAgent: SelectedAgent;
  setIsAgentSelected: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedAgent: React.Dispatch<React.SetStateAction<SelectedAgent>>;
  pinnedChat?: FilteredConversation;
}

const AgentCard = ({
  fullName,
  firstName,
  lastName,
  imageUrl,
  email,
  contactUri,
  selectedAgent,
  setIsAgentSelected,
  setSelectedAgent,
  pinnedChat,
}: AgentCardProps) => {
  const [isPressed, setIsPressed] = useState<boolean>(false);
  const [onHover, setOnHover] = useState<boolean>(false);
  const [, setWorkerName, agentActivity] = useLiveQueryClient();

  useEffect(() => {
    if (selectedAgent.email !== email) {
      setIsPressed(false);
    }
    setWorkerName(selectedAgent.fullName);
  }, [selectedAgent, agentActivity]);

  return (
    <Button
      variant="secondary"
      fullWidth
      pressed={onHover || isPressed ? true : false}
      onClick={() => {
        setSelectedAgent({
          fullName,
          firstName,
          lastName,
          imageUrl,
          activityName: agentActivity,
          email,
          contactUri,
        });
        setIsAgentSelected(true);
        setIsPressed(!isPressed);
      }}
      onMouseEnter={() => {
        setOnHover(true);
      }}
      onMouseLeave={() => {
        setOnHover(false);
      }}
    >
      <Flex hAlignContent="between" vAlignContent="center" width="100%">
        <Stack orientation="horizontal" spacing="space30">
          <Avatar size="sizeIcon80" name={fullName} src={imageUrl} />
          <Text as="span" marginRight="space40">
            {fullName}
          </Text>
        </Stack>
        {pinnedChat?.unreadMessagesNumber !== null &&
          pinnedChat?.unreadMessagesNumber !== undefined &&
          pinnedChat?.unreadMessagesNumber !== 0 && (
            <Badge as="span" variant="neutral_counter">
              {pinnedChat?.unreadMessagesNumber >= 99
                ? '99+'
                : pinnedChat?.unreadMessagesNumber}
            </Badge>
          )}
      </Flex>
    </Button>
  );
};

export default AgentCard;
