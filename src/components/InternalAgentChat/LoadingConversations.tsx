import React from 'react';
import { Spinner } from '@twilio-paste/core/spinner';
import { Flex } from '@twilio-paste/core/flex';
import { Text } from '@twilio-paste/text';

const LoadingConversations = () => (
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

export default LoadingConversations;
