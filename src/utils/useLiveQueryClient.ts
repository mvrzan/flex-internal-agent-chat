import { Manager, WorkerAttributes } from '@twilio/flex-ui';
import { useEffect, useState } from 'react';
import { LiveQuery } from 'twilio-sync/lib/livequery';
import { WorkerData } from './types';

export const useLiveQueryClient = () => {
  const [workerName, setWorkerName] = useState<string>('');
  const [workerData, setWorkerData] = useState<WorkerAttributes>();
  const [liveQueryClient, setLiveQueryClient] = useState<LiveQuery | null>();
  const [agentActivity, setAgentActivity] = useState<string>('');

  useEffect(() => {
    let hookInvoked = true;
    const initLiveQueryClient = async () => {
      if (!hookInvoked) return;
      const liveQuery = await Manager.getInstance().insightsClient.liveQuery(
        'tr-worker',
        `data.attributes.full_name CONTAINS "${workerName}"`
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

      if (workerdata.length === 1) {
        setAgentActivity(workerdata[0]?.activityName);
      }

      liveQuery?.on('itemUpdated', (args: WorkerAttributes) => {
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

        if (args.value.attributes.full_name === workerName) {
          setAgentActivity(args.value.activity_name);
        }

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
  }, [workerName]);

  return [workerData, setWorkerName, agentActivity] as const;
};
