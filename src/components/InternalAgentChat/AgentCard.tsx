import { useState } from 'react';
import { StatusBadge } from '@twilio-paste/core/status';
import { Stack, Avatar, Text, Flex, Tooltip, Button } from '@twilio-paste/core';

interface AgentCardProps {
  fullName: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
  activityName: string;
  email: string;
  setIsAgentSelected: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedAgent: React.Dispatch<React.SetStateAction<{}>>;
}

// TODO: Randomly change the color of avatars: https://paste.twilio.design/components/avatar#changing-the-color-of-an-avatar
const AgentCard = ({
  fullName,
  firstName,
  lastName,
  imageUrl,
  activityName,
  email,
  setIsAgentSelected,
  setSelectedAgent,
}: AgentCardProps) => {
  const [isPressed, setIsPressed] = useState(false);
  const [onHover, setOnHover] = useState(false);

  return (
    <Button
      variant="secondary"
      fullWidth
      pressed={isPressed ? isPressed : onHover}
      onClick={() => {
        setIsPressed(!isPressed);
        setSelectedAgent({
          fullName,
          firstName,
          lastName,
          imageUrl,
          activityName,
          email,
        });
        setIsAgentSelected(true);
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
