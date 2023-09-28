import * as Flex from '@twilio/flex-ui';
import { useEffect, useState } from 'react';
import { Conversation } from '@twilio/conversations';

const useSubscribedConversations = (activeView: string | undefined) => {
  const [totalUnreadMessagesNumber, setTotalUnreadMessagesNumber] =
    useState<number>(0);
  const [activeConversations, setActiveConversations] =
    useState<Conversation[]>();
  const conversationClient = Flex.Manager.getInstance().conversationsClient;

  useEffect(() => {
    const getSubscribedConversations = async () => {
      try {
        const subscribedConversationsResponse =
          await conversationClient.getSubscribedConversations();

        const internalAgentChatConversations =
          subscribedConversationsResponse.items.filter(
            (conversation: Conversation) => {
              if (conversation.attributes) {
                // TODO: change this to internalChat
                if (
                  conversation.attributes.hasOwnProperty('testAttribute') &&
                  conversation.state?.current === 'active'
                )
                  return conversation;
              }
            }
          );

        console.log('filteredConversations', internalAgentChatConversations);

        setActiveConversations(internalAgentChatConversations);

        return internalAgentChatConversations;
      } catch (error) {
        if (error instanceof Error) {
          console.error(
            'There was a problem getting all active conversations.',
            error
          );
        }
      }
    };

    const checkUnreadMessages = async () => {
      try {
        const internalAgentChatConversations =
          await getSubscribedConversations();
        let unreadMessageCounter = 0;

        if (internalAgentChatConversations?.length === 0) return;

        internalAgentChatConversations?.forEach(
          async (conversation: Conversation) => {
            const unreadMessagesNumber =
              await conversation.getUnreadMessagesCount();

            if (unreadMessagesNumber) {
              unreadMessageCounter += unreadMessagesNumber;
              setTotalUnreadMessagesNumber(unreadMessageCounter);

              // filter activeConversations based on unreadMessagesNumber
            }
          }
        );
      } catch (error) {
        if (error instanceof Error) {
          console.error(
            'There was a problem getting unread message count.',
            error
          );
        }
      }
    };

    const setConversationListeners = async () => {
      try {
        const subscribedConversations = await getSubscribedConversations();

        console.log('hereI am', subscribedConversations);

        subscribedConversations?.forEach((conversation: Conversation) => {
          conversation.on('messageAdded', message => {
            console.log('message added from new hook 1');
          });
        });
      } catch (error) {
        if (error instanceof Error) {
          console.error(
            'There was a problem setting up a conversation event listener.',
            error
          );
        }
      }
    };
    setConversationListeners();
  }, [activeView]);

  return totalUnreadMessagesNumber;
};

export default useSubscribedConversations;
