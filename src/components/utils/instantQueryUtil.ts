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

export default getWorkers;
