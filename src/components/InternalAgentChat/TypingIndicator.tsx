import { Stack, Text } from '@twilio-paste/core';
import './TypingIndicator.css';

interface TypingIndicatorProps {
  agentName: string;
}

const TypingIndicator = ({ agentName }: TypingIndicatorProps) => {
  return (
    <Text as="span" fontStyle="italic" fontSize="fontSize20">
      <Stack orientation="horizontal" spacing="space0">
        {`${agentName} is typing`} <div className="dot-flashing" />
      </Stack>
    </Text>
  );
};

export default TypingIndicator;
