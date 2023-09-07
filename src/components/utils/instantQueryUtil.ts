import { Manager } from '@twilio/flex-ui';

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

const getWorkers = async (query = '') => {
  const queryItems: any = await instantQuerySearch(
    'tr-worker',
    `${query !== '' ? `${query}` : ''}`
  );

  const responseWorkers = Object.keys(queryItems)
    .map(workerSid => queryItems[workerSid])
    .map(worker => {
      const { image_url, full_name } = worker.attributes;
      return [image_url, full_name];
    });

  return responseWorkers;
};

export default getWorkers;
