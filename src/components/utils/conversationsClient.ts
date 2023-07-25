import * as Flex from '@twilio/flex-ui';

export const userToken = Flex.Manager.getInstance().user.token;

export const conversationClient =
  Flex.Manager.getInstance().conversationsClient;
