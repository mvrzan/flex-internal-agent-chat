import { Manager, WorkerAttributes } from '@twilio/flex-ui';

/**
 * Promise wrapper for instantQuery search. Enables the caller
 * to await the search results instead of configuring callbacks
 * and query result listeners.
 * @param index instant query index to search
 * @param query query expression
 * @returns Promise of query results
 */

interface Worker {
  activity_name: string;
  attributes: WorkerAttributes;
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

  const queryPromise = new Promise(resolve => {
    instantQueryClient.on('searchResult', items => {
      resolve(items);
    });
  });

  await instantQueryClient.search(query);
  return queryPromise;
};

// TODO: Fix queryItems type
const getWorkers = async (query = '') => {
  const queryItems: any = await instantQuerySearch(
    'tr-worker',
    `${query !== '' ? `${query}` : ''}`
  );

  const responseWorkers = Object.keys(queryItems)
    .map(workerSid => queryItems[workerSid])
    .map(worker => {
      const { contact_uri, full_name, email, image_url } = worker.attributes;
      const workerSid = worker.worker_sid;

      return {
        firstName: full_name.split(' ')[0],
        lastName: full_name.split(' ')[1],
        fullName: full_name,
        imageUrl: image_url,
        value: contact_uri,
        workerSid,
        email,
      };
    });

  return responseWorkers;
};

export default getWorkers;
