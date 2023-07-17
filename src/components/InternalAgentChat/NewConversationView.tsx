import { Card, Heading, Paragraph, Text } from '@twilio-paste/core';

const NewConversationView = ({ selectedAgent }: any) => {
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
          and you. Check out their profile to learn more about them.
        </Paragraph>
      </Text>
    </Card>
  );
};

export default NewConversationView;
