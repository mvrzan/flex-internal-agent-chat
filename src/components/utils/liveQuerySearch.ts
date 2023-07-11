import { Manager, WorkerAttributes } from '@twilio/flex-ui';

const liveQuerySearch = async (index: string, query: string) => {
  const liveQueryClient = await Manager.getInstance().insightsClient.liveQuery(
    index,
    query
  );

  const items = liveQueryClient.getItems();
  console.log('items', items);
  const workerdata = Object.values(items).map((worker: any) => {
    return {
      firstName: worker.attributes.full_name.split(' ')[0],
      lastName: worker.attributes.full_name.split(' ')[1],
      fullName: worker.attributes.full_name,
      imageUrl: worker.attributes.image_url,
      value: worker.attributes.contact_uri,
      workerSid: worker.worker_sid,
      email: worker.attributes.email,
      activityName: worker.activity_name,
    };
  });

  console.log('workerdata', workerdata);

  let testData = { ...workerdata };
  liveQueryClient.on('itemRemoved', function (args) {
    console.log('Worker ' + args.key + ' is no longer "Available"');
  });
  liveQueryClient.on('itemUpdated', function (args) {
    console.log(args);
    console.log('Worker ' + args.key + ' is now ' + args.value.activity_name);
    testData[0].activityName = 'test';
  });

  // const updatedWorkerdata = {
  //   ...workerdata,
  //   activityName
  // }

  return workerdata;
};

export default liveQuerySearch;
