import { Manager, WorkerAttributes } from '@twilio/flex-ui';
import { useEffect, useState } from 'react';
import { SelectedAgent } from './types';

export const liveQuerySearch = async (index: string, query: string) => {
  const liveQueryClient = await Manager.getInstance().insightsClient.liveQuery(
    index,
    query
  );

  const workers = liveQueryClient.getItems();

  const workerdata = Object.values(workers).map((worker: WorkerAttributes) => {
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

  return [liveQueryClient, workerdata];
};

export const useLiveQueryClient = (selectedAgent: string) => {
  const [agentActivity, setAgentActivity] = useState<string>('');
  const [agentContactUri, setAgentContactUri] = useState<string>('');

  useEffect(() => {
    const getAgentActivity = async () => {
      agentActivityFunction(selectedAgent);
    };
    getAgentActivity();
  }, [selectedAgent]);

  const agentActivityFunction = async (
    selectedAgent: string
  ): Promise<void> => {
    const [liveQueryClient, workerData] = await liveQuerySearch(
      'tr-worker',
      `data.attributes.full_name CONTAINS "${selectedAgent}"`
    );

    // @ts-ignore
    setAgentActivity(workerData[0]?.activityName);

    // @ts-ignore
    setAgentContactUri(workerData[0]?.contactUri);

    // @ts-ignore
    liveQueryClient.on('itemUpdated', (args: any) => {
      if (args.value.attributes.full_name === selectedAgent) {
        setAgentActivity(args.value.activity_name);
        setAgentContactUri(args.value.attributes.contact_uri.split(':')[1]);
        console.log('itemUpdated', args.value.activity_name);
        console.log(
          'itemUpdated',
          args.value.attributes.contact_uri.split(':')[1]
        );
      }
    });
  };

  return [agentActivity, agentContactUri];
};
