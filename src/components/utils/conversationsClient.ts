import * as Flex from '@twilio/flex-ui';
import { Conversation } from '@twilio/conversations';

export const conversationClient =
  Flex.Manager.getInstance().conversationsClient;

export const getConversationByUniqueName = async (
  uniqueName: string
): Promise<Conversation> => {
  try {
    const fetchedConversation: Conversation =
      await conversationClient.getConversationByUniqueName(uniqueName);

    return fetchedConversation;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
    throw error;
  }
};
