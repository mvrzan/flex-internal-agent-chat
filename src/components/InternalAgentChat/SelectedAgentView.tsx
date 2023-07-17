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
import { Stack, Text, Separator } from '@twilio-paste/core';

const SelectedAgentView = ({ selectedAgent }: any) => {
  const userDialogList = useUserDialogListState();
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
    </Stack>
  );
};

export default SelectedAgentView;
