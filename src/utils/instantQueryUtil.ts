import { Manager } from '@twilio/flex-ui';

// Type: Utility
// Description: Contains a function that formats the selected agent data from the Flex InstantQuery

interface Worker {
  activity_name: string;
  attributes: {
    contact_uri: string;
    full_name: string;
    email: string;
    image_url: string;
  };
  date_activity_changed?: string;
  date_updated: string;
  friendly_name: string;
  worker_activity_sid: string;
  worker_sid: string;
  workspace_sid: string;
}

const instantQuerySearch = async (index: string, query: string) => {
  const instantQueryClient =
    await Manager.getInstance().insightsClient.instantQuery(index);

  const queryPromise = new Promise<Worker[]>(resolve => {
    instantQueryClient.on('searchResult', items => {
      resolve(items);
    });
  });

  await instantQueryClient.search(query);

  return queryPromise;
};

const getWorkers = async (
  query = '',
  querySearch = `data.attributes.full_name CONTAINS`
) => {
  const queryItems = await instantQuerySearch(
    'tr-worker',
    `${query !== '' ? `${querySearch} "${query}"` : ''}`
  );

  const responseWorkers = Object.keys(queryItems)
    .map(workerSid => <Worker>queryItems[workerSid as keyof typeof queryItems])
    .map(worker => {
      const { contact_uri, full_name, email, image_url } = worker.attributes;

      return {
        firstName: full_name.split(' ')[0],
        lastName: full_name.split(' ')[1],
        fullName: full_name,
        contactUri: contact_uri.split(':')[1],
        workerSid: worker.worker_sid,
        email,
        imageUrl: image_url,
        activityName: worker.activity_name,
      };
    });

  return responseWorkers;
};

export default getWorkers;
