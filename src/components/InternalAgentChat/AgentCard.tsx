import { Stack, Avatar } from '@twilio-paste/core';

interface AgentCardProps {
  agentName: string;
  imageUrl: string;
}

// TODO: Randomly change the color of avatars: https://paste.twilio.design/components/avatar#changing-the-color-of-an-avatar
const AgentCard = ({ agentName, imageUrl }: AgentCardProps) => {
  return (
    <Stack orientation="horizontal" spacing="space30">
      <Avatar size="sizeIcon80" name={agentName} src={imageUrl} />
    </Stack>
  );
};

export default AgentCard;
