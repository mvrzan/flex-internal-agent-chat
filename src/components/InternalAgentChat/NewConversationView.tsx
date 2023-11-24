import React from 'react';

import { Text } from '@twilio-paste/text';
import { Card } from '@twilio-paste/core/card';
import { Heading } from '@twilio-paste/core/heading';
import { Paragraph } from '@twilio-paste/core/paragraph';

import { SelectedAgent } from '../../utils/types';

interface NewConversationViewProps {
  selectedAgent: SelectedAgent;
}

const NewConversationView = ({ selectedAgent }: NewConversationViewProps) => {
  return (
    <Card>
      <Text as="div" textAlign="center">
        <Heading as="h2" variant="heading20">
          Start your chat!
        </Heading>
        <Paragraph>
          This conversation is just between{' '}
          <Text as="span" fontWeight="fontWeightSemibold">
            {selectedAgent.fullName}
          </Text>{' '}
          and you. Check out their profile to learn more about them. Type them a
          message to get the conversation going!
        </Paragraph>
      </Text>
    </Card>
  );
};

export default NewConversationView;
