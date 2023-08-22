import { Spinner, Flex, Text } from '@twilio-paste/core';

const LoadingConversations = () => {
  return (
    <Flex
      vertical
      vAlignContent="center"
      hAlignContent="center"
      marginTop="space100"
    >
      <Spinner
        decorative={false}
        title="Loading chat"
        size="sizeIcon110"
        color="colorTextPrimaryStrongest"
      />
      <Text as="span" fontWeight="fontWeightMedium" marginTop="space40">
        Loading your chat...
      </Text>
    </Flex>
  );
};

export default LoadingConversations;
