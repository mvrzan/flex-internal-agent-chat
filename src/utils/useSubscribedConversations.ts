import * as Flex from '@twilio/flex-ui';
import { useEffect, useState } from 'react';
import { Conversation } from '@twilio/conversations';
import { UnreadMessagesPayload } from '../states/CustomInternalChatState';
import { useDispatch } from 'react-redux';
import { actions } from '../states';
import { FilteredConversation } from './types';

const useSubscribedConversations = (activeView: string | undefined) => {
  const [activeConversations, setActiveConversations] =
    useState<FilteredConversation[]>();
  const conversationClient = Flex.Manager.getInstance().conversationsClient;
  const dispatch = useDispatch();

  const updateUnreadMessageCounter = (
    unreadMessagesNumber: UnreadMessagesPayload
  ) => dispatch(actions.customInternalChat.updateCounter(unreadMessagesNumber));

  const instantQuerySearch = async (index: string, query: string) => {
    const instantQueryClient =
      await Flex.Manager.getInstance().insightsClient.instantQuery(index);

    const queryPromise = new Promise(resolve => {
      instantQueryClient.on('searchResult', items => {
        resolve(items);
      });
    });

    await instantQueryClient.search(query);

    return queryPromise;
  };

  const getWorkers = async (query = '') => {
    const queryItems: any = await instantQuerySearch(
      'tr-worker',
      `${query !== '' ? `${query}` : ''}`
    );

    const responseWorkers = Object.keys(queryItems)
      .map(workerSid => queryItems[workerSid])
      .map(worker => {
        return {
          firstName: worker.attributes.full_name.split(' ')[0],
          lastName: worker.attributes.full_name.split(' ')[1],
          contactUri: worker.attributes.contact_uri.split(':')[1],
          fullName: worker.attributes.full_name,
          imageUrl: worker.attributes.image_url,
          value: worker.attributes.contact_uri,
          workerSid: worker.worker_sid,
          email: worker.attributes.email,
          activityName: worker.activity_name,
        };
      });

    return responseWorkers;
  };

  useEffect(() => {
    const getSubscribedConversations = async () => {
      try {
        const { items: allSubscribedConversationsArray } =
          await conversationClient.getSubscribedConversations();

        const onlyInternalAgentChatConversations =
          allSubscribedConversationsArray.filter(
            (conversation: Conversation) => {
              if (!conversation.attributes) return;

              if (
                conversation.attributes.hasOwnProperty('internalChat') &&
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

        internalAgentChatConversations?.forEach(
          async (conversation: Conversation) => {
            conversation.removeAllListeners();

            const unreadMessagesNumber =
              await conversation.getUnreadMessagesCount();

            if (unreadMessagesNumber === null) return;

            const newUnreadMessages = {
              unreadMessagesNumber: unreadMessagesNumber,
              conversationUniqueName: conversation.uniqueName,
            };

            updateUnreadMessageCounter(newUnreadMessages);

            conversation.on('messageAdded', async message => {
              try {
                const unreadMessagesNumber =
                  await conversation.getUnreadMessagesCount();

                if (unreadMessagesNumber === null) return;

                const newUnreadMessages = {
                  unreadMessagesNumber: unreadMessagesNumber,
                  conversationUniqueName: message.conversation.uniqueName,
                };

                updateUnreadMessageCounter(newUnreadMessages);

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
                `data.attributes.contact_uri CONTAINS "${participants[0]}"`
              );

              if (queryResponse === undefined) return;

              const formatConversationData = {
                ...queryResponse,
                uniqueName: conversation.uniqueName,
                participant: participants[0],
                unreadMessagesNumber,
                fetchedConversation: conversation,
              };

              setActiveConversations((prevState: any) => {
                if (prevState !== undefined) {
                  return [...prevState, formatConversationData];
                } else {
                  return [formatConversationData];
                }
              });
            } else {
              const [queryResponse] = await getWorkers(
                `data.attributes.contact_uri CONTAINS "${participants[1]}"`
              );

              if (queryResponse === undefined) return;

              const formatConversationData = {
                ...queryResponse,
                uniqueName: conversation.uniqueName,
                participant: participants[0],
                unreadMessagesNumber,
                fetchedConversation: conversation,
              };

              setActiveConversations(prevState => {
                if (prevState !== undefined) {
                  return [...prevState, formatConversationData];
                } else {
                  return [formatConversationData];
                }
              });
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
  }, [activeView]);

  return activeConversations;
};

export default useSubscribedConversations;
