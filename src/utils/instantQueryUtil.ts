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

    `${query !== '' ? `data.attributes.full_name CONTAINS "${query}"` : ''}`
  );

  const responseWorkers = Object.keys(queryItems)
    .map(workerSid => queryItems[workerSid])
    .map(worker => {
      const { contact_uri, full_name, email, image_url, activity_name } =
        worker.attributes;

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
