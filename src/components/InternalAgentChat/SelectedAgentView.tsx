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

const SelectedAgentView = ({ selectedAgent }: any) => {
  const userDialogList = useUserDialogListState();
  return (
    <UserDialogContainer name="Nora Kts">
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
      {selectedAgent.fullName}
    </UserDialogContainer>
  );
};

export default SelectedAgentView;
