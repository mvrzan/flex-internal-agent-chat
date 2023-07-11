import { Stack, Avatar, Text, Flex, Tooltip, Button } from '@twilio-paste/core';
import { StatusBadge } from '@twilio-paste/core/status';
import { useState, useEffect } from 'react';
import liveQuerySearch from '../utils/liveQuerySearch';

interface AgentCardProps {
  fullName: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
  activityName: string;
}

// TODO: Randomly change the color of avatars: https://paste.twilio.design/components/avatar#changing-the-color-of-an-avatar
const AgentCard = ({
  fullName,
  firstName,
  lastName,
  imageUrl,
  activityName,
}: AgentCardProps) => {
  const [isPressed, setIsPressed] = useState(false);
  const [onHover, setOnHover] = useState(false);
  const [activity, setActivity] = useState('');

  useEffect(() => {
    const getActivity = async () => {
      const agentActivity = await liveQuerySearch(
        'tr-worker',
        `data.attributes.full_name == "${fullName}"`
      );
      setActivity(agentActivity[0].activityName);
    };
    getActivity();
    console.log('activityName', activity);
  }, [activity]);

  return (
    <Button
      variant="secondary"
      fullWidth
      pressed={isPressed ? isPressed : onHover}
      onClick={() => {
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
        <Tooltip text={activity}>
          <StatusBadge
            as="span"
            variant={
              activity === 'Available'
                ? 'ConnectivityAvailable'
                : 'ConnectivityOffline'
            }
            size="small"
          >
            {' '}
          </StatusBadge>
        </Tooltip>
      </Flex>
    </Button>
  );
};

export default AgentCard;
