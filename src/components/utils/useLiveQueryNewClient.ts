import { Manager, WorkerAttributes } from '@twilio/flex-ui';
import { useEffect, useState } from 'react';
import { LiveQuery } from 'twilio-sync/lib/livequery';
import { WorkerData } from './types';

export const useLiveQueryClient = () => {
  const [agentName, setAgentName] = useState<string>('');
  const [workerData, setWorkerData] = useState<WorkerAttributes>();
  const [liveQueryClient, setLiveQueryClient] = useState<LiveQuery | null>();

  useEffect(() => {
    let hookInvoked = true;
    const initLiveQueryClient = async () => {
      const liveQuery = await Manager.getInstance().insightsClient.liveQuery(
        'tr-worker',
        `data.attributes.full_name CONTAINS "${agentName}"`
      );

      setLiveQueryClient(liveQuery);

      const workers = liveQuery.getItems();

      const workerdata = Object.values(workers).map(
        (worker: WorkerAttributes) => {
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
        }
      );
      setWorkerData(workerdata);

      liveQuery?.on('itemUpdated', args => {
        const updatedWorkerData = {
          firstName: args.value.attributes.full_name.split(' ')[0],
          lastName: args.value.attributes.full_name.split(' ')[1],
          contactUri: args.value.attributes.contact_uri.split(':')[1],
          fullName: args.value.attributes.full_name,
          imageUrl: args.value.attributes.image_url,
          value: args.value.attributes.contact_uri,
          workerSid: args.value.worker_sid,
          email: args.value.attributes.email,
          activityName: args.value.activity_name,
        };

        if (!hookInvoked) return;

        setWorkerData((prevWorkerData: WorkerData[] | undefined) => {
          if (prevWorkerData !== undefined) {
            const newWorkerData = prevWorkerData?.map(
              (workerData: WorkerData) => {
                if (workerData.contactUri === updatedWorkerData.contactUri) {
                  workerData.activityName = updatedWorkerData.activityName;
                }
                return workerData;
              }
            );
            return newWorkerData;
          }
        });
      });
    };
    initLiveQueryClient();

    return () => {
      hookInvoked = false;
      liveQueryClient?.close();
      console.log('Disconnecting liveQueryClient!');
    };
  }, [agentName]);

  return [workerData, setAgentName] as const;
};
