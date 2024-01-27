import { useEffect, useState } from 'react';
import * as Flex from '@twilio/flex-ui';
import { readFromLocalStorage } from '../utils/localStorageUtil';
import { FilteredWorkerInfo, Worker } from '../utils/types';

const usePinnedChats = (
  newPinnedChats: string[] | string | undefined,
  selectedAgentContactUri?: string
) => {
  const [pinnedChats, setPinnedChats] = useState<FilteredWorkerInfo[]>();
  const conversationClient = Flex.Manager.getInstance().conversationsClient;
  const uniqueName: string = [
    selectedAgentContactUri,
    conversationClient.user.identity,
  ]
    .sort()
    .join('+');

  const instantQuerySearch = async (index: string, query: string) => {
    const instantQueryClient =
      await Flex.Manager.getInstance().insightsClient.instantQuery(index);

    const queryPromise = new Promise<Worker[]>(resolve => {
      instantQueryClient.on('searchResult', items => {
        resolve(items);
      });
    });

    await instantQueryClient.search(query);

    return queryPromise;
  };

  const getWorkers = async (query = '') => {
    const queryItems = await instantQuerySearch(
      'tr-worker',
      `${query !== '' ? `${query}` : ''}`
    );

    const responseWorkers = Object.keys(queryItems)
      .map(
        workerSid => <Worker>queryItems[workerSid as keyof typeof queryItems]
      )
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
    let hookInvoked = true;

    const getPinnedChats = async () => {
      const pinnedChatsFromLocalStorage: string[] = JSON.parse(
        readFromLocalStorage('PinnedChats') as string
      );

      if (pinnedChatsFromLocalStorage === null || !hookInvoked) return;

      const filteredPinnedChats = pinnedChatsFromLocalStorage.map(
        async (pinnedChat: string) => {
          const fetchedConversation =
            await conversationClient.getConversationByUniqueName(pinnedChat);
          fetchedConversation.removeAllListeners();

          const unreadMessagesNumber =
            await fetchedConversation.getUnreadMessagesCount();

          fetchedConversation.on('messageAdded', async message => {
            const unreadMessagesNumber =
              await fetchedConversation.getUnreadMessagesCount();

            if (!hookInvoked) return;

            setPinnedChats(prevState => {
              if (prevState !== undefined) {
                return prevState.map(prevMessage =>
                  prevMessage.uniqueName === message.conversation.uniqueName
                    ? { ...prevMessage, unreadMessagesNumber }
                    : prevMessage
                );
              }
            });
          });

          const participants = [...fetchedConversation._participants].map(
            participant => participant[1].identity
          );

          // check if the participant is the logged in agent
          if (participants[0] !== conversationClient.user.identity) {
            const [queryResponse] = await getWorkers(
              `data.attributes.contact_uri CONTAINS "${participants[0]}"`
            );

            const formatConversationData = {
              ...queryResponse,
              uniqueName: fetchedConversation.uniqueName,
              participant: participants[0],
              unreadMessagesNumber,
              fetchedConversation,
            };

            return formatConversationData;
          } else {
            const [queryResponse] = await getWorkers(
              `data.attributes.contact_uri CONTAINS "${participants[1]}"`
            );

            const formatConversationData = {
              ...queryResponse,
              uniqueName: fetchedConversation.uniqueName,
              participant: participants[0],
              unreadMessagesNumber,
              fetchedConversation,
            };

            return formatConversationData;
          }
        }
      );

      const awaitedFilteredPinnedChats = await Promise.all(filteredPinnedChats);

      setPinnedChats(awaitedFilteredPinnedChats);
    };
    getPinnedChats();

    return () => {
      hookInvoked = false;
    };
  }, [newPinnedChats]);

  useEffect(() => {
    if (selectedAgentContactUri === undefined) return;
    pinnedChats?.forEach((chat: FilteredWorkerInfo) => {
      if (chat === undefined) return;

      if (chat.uniqueName === uniqueName) {
        chat.fetchedConversation.setAllMessagesRead();

        setPinnedChats(prevState => {
          if (prevState !== undefined) {
            return prevState.map(prevMessage => {
              return { ...prevMessage, unreadMessagesNumber: 0 };
            });
          }
        });

        chat.fetchedConversation.on('messageAdded', async message => {
          const unreadMessagesNumber =
            await chat.fetchedConversation.getUnreadMessagesCount();

          setPinnedChats(prevState => {
            if (prevState !== undefined) {
              return prevState.map(prevMessage =>
                prevMessage.uniqueName === message.conversation.uniqueName
                  ? { ...prevMessage, unreadMessagesNumber }
                  : prevMessage
              );
            }
          });
        });
      } else {
        chat.fetchedConversation.on('messageAdded', async message => {
          const unreadMessagesNumber =
            await chat.fetchedConversation.getUnreadMessagesCount();

          setPinnedChats(prevState => {
            if (prevState !== undefined) {
              return prevState.map(prevMessage =>
                prevMessage.uniqueName === message.conversation.uniqueName
                  ? { ...prevMessage, unreadMessagesNumber }
                  : prevMessage
              );
            }
          });
        });
      }
    });
  }, [selectedAgentContactUri]);

  return pinnedChats;
};

export default usePinnedChats;
