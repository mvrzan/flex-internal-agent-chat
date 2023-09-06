import {
  UserDialog,
  useUserDialogListState,
  UserDialogContainer,
  UserDialogUserInfo,
  UserDialogUserName,
  UserDialogUserEmail,
  UserDialogList,
  UserDialogListItem,
} from '@twilio-paste/core/user-dialog';
import { Stack, Text, StatusBadge } from '@twilio-paste/core';
import { useCallback } from 'react';
import { useLiveQueryClient } from '../utils/useLiveQuery';
import { SelectedAgent } from '../utils/types';

interface SelectedAgentViewProps {
  selectedAgent: SelectedAgent;
}

const SelectedAgentView = ({ selectedAgent }: SelectedAgentViewProps) => {
  const userDialogList = useUserDialogListState();
  const [agentActivity] = useLiveQueryClient(selectedAgent.fullName);

  const NewStatusBadge = useCallback(() => {
    if (agentActivity === '') {
      return (
        <StatusBadge
          as="span"
          variant={
            selectedAgent.activityName === 'Available'
              ? 'ConnectivityAvailable'
              : selectedAgent.activityName === 'Offline'
              ? 'ConnectivityOffline'
              : 'ConnectivityBusy'
          }
        >
          {selectedAgent.activityName}
        </StatusBadge>
      );
    } else {
      return (
        <StatusBadge
          as="span"
          variant={
            agentActivity === 'Available'
              ? 'ConnectivityAvailable'
              : agentActivity === 'Offline'
              ? 'ConnectivityOffline'
              : 'ConnectivityBusy'
          }
        >
          {agentActivity}
        </StatusBadge>
      );
    }
  }, [agentActivity]);

  return (
    <Stack orientation="horizontal" spacing="space40">
      <UserDialogContainer
        name={selectedAgent.fullName}
        src={selectedAgent.imageUrl}
      >
        <UserDialog aria-label="my_user_menu">
          <UserDialogUserInfo>
            <UserDialogUserName>{selectedAgent.fullName}</UserDialogUserName>
            <UserDialogUserEmail>{selectedAgent.email}</UserDialogUserEmail>
          </UserDialogUserInfo>
          <UserDialogList {...userDialogList} aria-label="User menu actions">
            <UserDialogListItem {...userDialogList} onSelect={() => {}}>
              Copy Agent email
            </UserDialogListItem>
            <UserDialogListItem {...userDialogList} onSelect={() => {}}>
              Start the chat
            </UserDialogListItem>
          </UserDialogList>
        </UserDialog>
      </UserDialogContainer>
      <Text as="span" fontWeight="fontWeightSemibold" fontSize="fontSize50">
        {selectedAgent.fullName}
      </Text>
      <NewStatusBadge />
    </Stack>
  );
};

export default SelectedAgentView;
