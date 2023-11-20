import * as Flex from '@twilio/flex-ui';
import { useEffect, useState } from 'react';
import { Conversation } from '@twilio/conversations';
import { UnreadMessagesPayload } from '../states/CustomInternalChatState';
import { useDispatch } from 'react-redux';
import { actions } from '../states';
import { FilteredConversation } from './types';
import { readFromLocalStorage } from './localStorageUtil';

const useConversations = (
  activeView: string | undefined,
  newPinnedChats: string[] | string | undefined,
  pinnedChatState?: boolean,
  selectedAgentContactUri?: string
) => {
  const [pinnedConversations, setPinnedConversations] = useState<
    FilteredConversation[] | undefined
  >([]);
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

    console.log('responseWorkers', responseWorkers);

    return responseWorkers;
  };

  useEffect(() => {
    const localActiveConversations: [] = [];
    const localPinnedConversations: [] = [];

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

    const init = async () => {
      try {
        // get conversations only pertaining to internal agent chat
        const internalAgentChatConversations =
          await getSubscribedConversations();

        if (
          internalAgentChatConversations?.length === 0 ||
          !internalAgentChatConversations
        )
          return;

        // get pinned chats from browser local storage
        const pinnedChatsFromLocalStorage: string[] = JSON.parse(
          readFromLocalStorage('PinnedChats') as string
        );

        if (pinnedChatsFromLocalStorage?.length === 0)
          setPinnedConversations([]);

        // loop through internal agent chat conversations
        for (const conversation of internalAgentChatConversations) {
          conversation.removeAllListeners();

          const unreadMessagesNumber =
            await conversation.getUnreadMessagesCount();

          if (unreadMessagesNumber === null) continue;

          const newUnreadMessages = {
            unreadMessagesNumber,
            conversationUniqueName: conversation.uniqueName,
          };

          // update the redux store for the SideNav unread message counter
          updateUnreadMessageCounter(newUnreadMessages);

          // The Conversation object holds participants in a Map
          // Check if the participant is the logged in agent and
          // filter out the agent you are talking to
          const participants = [...conversation._participants]
            .map(participant => {
              if (
                participant[1].identity !== conversationClient.user.identity
              ) {
                return participant[1].identity;
              }
            })
            .filter(participant => participant);

          // use instantQuery to get worker details based on the filtered participant
          const [queryResponse] = await getWorkers(
            `data.attributes.contact_uri CONTAINS "${participants[0]}"`
          );

          if (queryResponse === undefined) continue;

          // format Conversation data for use in other components
          const formatConversationData = {
            ...queryResponse,
            uniqueName: conversation.uniqueName,
            participant: participants[0],
            unreadMessagesNumber,
            fetchedConversation: conversation,
          };

          // check if pinned chats in local storage include the conversation unique name
          if (!pinnedChatsFromLocalStorage.includes(conversation.uniqueName!)) {
            // @ts-expect-error quite
            localActiveConversations.push(formatConversationData);
          } else {
            // @ts-expect-error quite
            localPinnedConversations.push(formatConversationData);
          }

          conversation.on('messageAdded', async message => {
            try {
              if (conversation.uniqueName === uniqueName) {
                conversation.setAllMessagesRead();
              }

              const unreadMessagesNumber =
                await conversation.getUnreadMessagesCount();

              if (unreadMessagesNumber === null) return;

              const newUnreadMessages = {
                unreadMessagesNumber,
                conversationUniqueName: message.conversation.uniqueName,
              };

              updateUnreadMessageCounter(newUnreadMessages);

              if (
                !pinnedChatsFromLocalStorage.includes(conversation.uniqueName!)
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
              } else {
                setPinnedConversations(prevConversations => {
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
        }

        setActiveConversations(localActiveConversations);
        setPinnedConversations(localPinnedConversations);
      } catch (error) {
        if (error instanceof Error) {
          console.error(
            'There was a problem getting unread message count.',
            error
          );
        }
      }
    };

    init();
  }, [activeView, newPinnedChats, pinnedChatState]);

  useEffect(() => {
    // when the agent opens a chat mark the conversation messages as read for activeConversations
    activeConversations?.forEach(conversation => {
      if (conversation === undefined || conversation.uniqueName !== uniqueName)
        return;

      conversation.fetchedConversation.setAllMessagesRead();

      setActiveConversations(prevConversations => {
        if (prevConversations === undefined) return;

        return prevConversations.map(prevConversation =>
          prevConversation.uniqueName === uniqueName
            ? {
                ...prevConversation,
                unreadMessagesNumber: 0,
              }
            : prevConversation
        );
      });
    });

    // when the agent opens a chat mark the conversation messages as read for pinnedConversations
    pinnedConversations?.forEach(conversation => {
      if (conversation === undefined || conversation.uniqueName !== uniqueName)
        return;

      conversation.fetchedConversation.setAllMessagesRead();

      setPinnedConversations(prevConversations => {
        if (prevConversations === undefined) return;

        return prevConversations.map(prevConversation =>
          prevConversation.uniqueName === uniqueName
            ? {
                ...prevConversation,
                unreadMessagesNumber: 0,
              }
            : prevConversation
        );
      });
    });
  }, [selectedAgentContactUri]);

  return [activeConversations, pinnedConversations];
};

export default useConversations;
