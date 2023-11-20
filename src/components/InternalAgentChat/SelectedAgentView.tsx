import { useCallback, useEffect } from 'react';
import * as Flex from '@twilio/flex-ui';
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
import { SelectedAgent } from '../../utils/types';
import { PinIcon } from '@twilio-paste/icons/esm/PinIcon';
import { DeleteIcon } from '@twilio-paste/icons/esm/DeleteIcon';
import { useLiveQueryClient } from '../../utils/useLiveQueryClient';
import {
  writeToLocalStorage,
  readFromLocalStorage,
} from '../../utils/localStorageUtil';

interface SelectedAgentViewProps {
  selectedAgent: SelectedAgent;
  setPinnedChats: React.Dispatch<React.SetStateAction<string[] | undefined>>;
  pinnedChatState: boolean;
  setPinnedChatState: React.Dispatch<React.SetStateAction<boolean>>;
}

const SelectedAgentView = ({
  selectedAgent,
  setPinnedChats,
  pinnedChatState,
  setPinnedChatState,
}: SelectedAgentViewProps) => {
  const userDialogList = useUserDialogListState();
  const [_, setWorkerName, agentActivity] = useLiveQueryClient();
  const conversationClient = Flex.Manager.getInstance().conversationsClient;
  const uniqueName: string = [
    selectedAgent.contactUri,
    conversationClient.user.identity,
  ]
    .sort()
    .join('+');

  useEffect(() => {
    setWorkerName(selectedAgent.fullName);
  }, [selectedAgent, agentActivity]);

  const pinnedChatHandler = () => {
    const chatIdentifier: string = uniqueName;
    const previousValues: string[] = JSON.parse(
      readFromLocalStorage('PinnedChats') as string
    );

    if (previousValues?.includes(chatIdentifier)) return;

    if (Array.isArray(previousValues)) {
      const updatedValue = [...previousValues, chatIdentifier];
      writeToLocalStorage('PinnedChats', updatedValue);
      setPinnedChats(updatedValue);
      setPinnedChatState(!pinnedChatState);
    } else {
      writeToLocalStorage('PinnedChats', [chatIdentifier]);
      setPinnedChats([chatIdentifier]);
      setPinnedChatState(!pinnedChatState);
    }
  };

  const deletePinnedChatHandler = () => {
    const pinnedChats: string[] = JSON.parse(
      readFromLocalStorage('PinnedChats') as string
    );

    if (pinnedChats === null) return;

    const filteredChats = pinnedChats.filter(item => item !== uniqueName);
    if (filteredChats.length === 0) {
      writeToLocalStorage('PinnedChats', [...filteredChats]);
    }
    setPinnedChats(filteredChats);
    writeToLocalStorage('PinnedChats', [...filteredChats]);
    setPinnedChatState(!pinnedChatState);
  };

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
            <UserDialogListItem
              {...userDialogList}
              onSelect={pinnedChatHandler}
            >
              <PinIcon decorative /> Pin chat
            </UserDialogListItem>
            <UserDialogListItem
              {...userDialogList}
              onSelect={deletePinnedChatHandler}
            >
              <DeleteIcon decorative /> Unpin chat
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
