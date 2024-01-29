import * as Flex from '@twilio/flex-ui';
import { useEffect, useState } from 'react';
import { Conversation } from '@twilio/conversations';
import { UnreadMessagesPayload } from '../states/CustomInternalChatState';
import { useDispatch } from 'react-redux';
import { actions } from '../states';
import { FilteredConversation } from '../utils/types';
import { readFromLocalStorage } from '../utils/localStorageUtil';
import getWorkers from '../utils/instantQueryUtil';

const useSubscribedConversations = (
  activeView: string | undefined,
  pinnedChatState?: boolean,
  selectedAgentContactUri?: string
) => {
  const [activeConversations, setActiveConversations] = useState<
    FilteredConversation[] | undefined
  >([]);
  const conversationClient = Flex.Manager.getInstance().conversationsClient;
  const dispatch = useDispatch();
  const uniqueName: string = [
    selectedAgentContactUri,
    conversationClient.user.identity,
  ]
    .sort()
    .join('+');

  const updateUnreadMessageCounter = (
    unreadMessagesNumber: UnreadMessagesPayload
  ) => dispatch(actions.customInternalChat.updateCounter(unreadMessagesNumber));

  useEffect(() => {
    setActiveConversations([]);
    const getSubscribedConversations = async () => {
      try {
        const { items: allSubscribedConversationsArray } =
          await conversationClient.getSubscribedConversations();

        const onlyInternalAgentChatConversations =
          allSubscribedConversationsArray.filter(
            (conversation: Conversation) => {
              if (!conversation.attributes) return;

              if (
                Object.prototype.hasOwnProperty.call(
                  conversation.attributes,
                  'internalChat'
                ) &&
                conversation.state?.current === 'active'
              )
                return conversation;
            }
          );

        return onlyInternalAgentChatConversations;
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

        if (internalAgentChatConversations?.length === 0) return;

        const pinnedChatsFromLocalStorage: string[] =
          JSON.parse(readFromLocalStorage('PinnedChats') as string) ?? [];

        internalAgentChatConversations?.forEach(
          async (conversation: Conversation) => {
            conversation.removeAllListeners();
            // setActiveConversations(undefined);

            if (conversation.uniqueName === uniqueName) {
              conversation.setAllMessagesRead();
            }

            const unreadMessagesNumber =
              await conversation.getUnreadMessagesCount();

            if (unreadMessagesNumber === null) return;

            const newUnreadMessages = {
              unreadMessagesNumber,
              conversationUniqueName: conversation.uniqueName,
            };

            updateUnreadMessageCounter(newUnreadMessages);

            conversation.on('messageAdded', async message => {
              try {
                const unreadMessagesNumber =
                  await conversation.getUnreadMessagesCount();

                if (unreadMessagesNumber === null) return;

                const newUnreadMessages = {
                  unreadMessagesNumber,
                  conversationUniqueName: message.conversation.uniqueName,
                };

                updateUnreadMessageCounter(newUnreadMessages);

                if (
                  !pinnedChatsFromLocalStorage.includes(
                    conversation.uniqueName!
                  )
                ) {
                  setActiveConversations(prevConversations => {
                    if (prevConversations !== undefined) {
                      return prevConversations.map(prevConversation =>
                        prevConversation.uniqueName ===
                        message.conversation.uniqueName
                          ? { ...prevConversation, unreadMessagesNumber }
                          : prevConversation
                      );
                    }
                  });
                }
              } catch (error) {
                if (error instanceof Error) {
                  console.error(
                    'There was a problem getting unread message count when a new messages has been added',
                    error
                  );
                }
              }
            });

            const participants = [...conversation._participants]
              .map(participant => {
                if (
                  participant[1].identity !== conversationClient.user.identity
                ) {
                  return participant[1].identity;
                }
              })
              .filter(participant => participant);

            // check if the participant is the logged in agent
            if (participants[0] !== conversationClient.user.identity) {
              const [queryResponse] = await getWorkers(
                participants[0] as string,
                `data.attributes.contact_uri CONTAINS`
              );

              if (queryResponse === undefined) return;

              const formatConversationData = {
                ...queryResponse,
                uniqueName: conversation.uniqueName,
                participant: participants[0],
                unreadMessagesNumber,
                fetchedConversation: conversation,
              };

              if (
                !pinnedChatsFromLocalStorage.includes(conversation.uniqueName!)
              ) {
                setActiveConversations(prevState => {
                  if (prevState !== undefined) {
                    return [...prevState, formatConversationData];
                  } else {
                    return [formatConversationData];
                  }
                });
              }
            } else {
              const [queryResponse] = await getWorkers(
                participants[1] as string,
                `data.attributes.contact_uri CONTAINS`
              );

              if (queryResponse === undefined) return;

              const formatConversationData = {
                ...queryResponse,
                uniqueName: conversation.uniqueName,
                participant: participants[0],
                unreadMessagesNumber,
                fetchedConversation: conversation,
              };

              if (
                !pinnedChatsFromLocalStorage.includes(conversation.uniqueName!)
              ) {
                setActiveConversations(prevState => {
                  if (prevState !== undefined) {
                    return [...prevState, formatConversationData];
                  } else {
                    return [formatConversationData];
                  }
                });
              }
            }

            // TODO: filter activeConversations based on unreadMessagesNumber count and date so the newest ones are at the top of the array
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

    checkUnreadMessages();
  }, [activeView, pinnedChatState]);

  return activeConversations;
};

export default useSubscribedConversations;
