import { useState, useEffect } from 'react';
import { StatusBadge } from '@twilio-paste/core/status';
import { Stack, Avatar, Text, Flex, Tooltip, Button } from '@twilio-paste/core';
import { SelectedAgent } from '../utils/types';

interface AgentCardProps {
  fullName: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
  activityName: string;
  email: string;
  contactUri: string;
  selectedAgent: SelectedAgent;
  setIsAgentSelected: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedAgent: React.Dispatch<React.SetStateAction<SelectedAgent>>;
}

// TODO: Randomly change the color of avatars: https://paste.twilio.design/components/avatar#changing-the-color-of-an-avatar
const AgentCard = ({
  fullName,
  firstName,
  lastName,
  imageUrl,
  activityName,
  email,
  contactUri,
  selectedAgent,
  setIsAgentSelected,
  setSelectedAgent,
}: AgentCardProps) => {
  const [isPressed, setIsPressed] = useState<boolean>(false);
  const [onHover, setOnHover] = useState<boolean>(false);

  useEffect(() => {
    if (selectedAgent.email !== email) {
      setIsPressed(false);
    }
  }, [selectedAgent]);

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
          activityName,
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
        <Tooltip text={activityName}>
          <StatusBadge
            as="span"
            variant={
              activityName === 'Available'
                ? 'ProcessSuccess'
                : activityName === 'Offline'
                ? 'ProcessDisabled'
                : 'ProcessWarning'
            }
          >
            {' '}
          </StatusBadge>
        </Tooltip>
      </Flex>
    </Button>
  );
};

export default AgentCard;
