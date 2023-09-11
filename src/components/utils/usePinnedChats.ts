import { useEffect, useState } from 'react';
import * as Flex from '@twilio/flex-ui';
import { readFromLocalStorage } from '../utils/localStorageUtil';
import { FilteredWorkerInfo } from './types';

const usePinnedChats = (newPinnedChats: string[] | undefined) => {
  const [pinnedChats, setPinnedChats] = useState<FilteredWorkerInfo[]>();
  const conversationClient = Flex.Manager.getInstance().conversationsClient;

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
    const getPinnedChats = async () => {
      const pinnedChatsFromLocalStorage: string[] = JSON.parse(
        readFromLocalStorage('PinnedChats') as string
      );

      if (pinnedChatsFromLocalStorage === null) return;

      const filteredPinnedChats = pinnedChatsFromLocalStorage.map(
        async (pinnedChat: string) => {
          const fetchedConversation =
            await conversationClient.getConversationByUniqueName(pinnedChat);

          const participants = [...fetchedConversation._participants].map(
            participant => participant[1].identity
          );

          const [queryResponse] = await getWorkers(
            `data.attributes.contact_uri CONTAINS "${participants[0]}"`
          );

          const formatConversationData = {
            ...queryResponse,
            uniqueName: fetchedConversation.uniqueName,
            participant: participants[0],
          };

          return formatConversationData;
        }
      );

      const awaitedFilteredPinnedChats = await Promise.all(filteredPinnedChats);

      setPinnedChats(awaitedFilteredPinnedChats);
    };
    getPinnedChats();
  }, [newPinnedChats]);

  return pinnedChats;
};

export default usePinnedChats;
