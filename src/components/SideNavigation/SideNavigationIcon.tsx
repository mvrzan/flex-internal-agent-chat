import { useSelector } from 'react-redux';
import { Badge, Stack } from '@twilio-paste/core';
import { SideLink, Actions } from '@twilio/flex-ui';
import { namespace, AppState } from '../../states';
import usePinnedChats from '../utils/usePinnedChats';
import MessageIconWithBadge from './MessageIconWithBadge';

interface SideNavigationProps {
  activeView?: string;
  viewName: string;
}

const SideNavigationIcon = ({ activeView, viewName }: SideNavigationProps) => {
  usePinnedChats(undefined);

  const navigateHandler = () => {
    Actions.invokeAction('NavigateToView', {
      viewName: viewName,
    });
  };

  const reduxUnreadMessages = useSelector(
    (state: AppState) => state[namespace].customInternalChat.unreadMessages
  );

  return (
    <SideLink
      showLabel
      icon={
        <MessageIconWithBadge activeView={activeView} viewName={viewName} />
      }
      iconActive={
        <MessageIconWithBadge activeView={activeView} viewName={viewName} />
      }
      onClick={navigateHandler}
      isActive={activeView === viewName}
      key="InternalAgentChat"
    >
      {reduxUnreadMessages !== null &&
      reduxUnreadMessages !== undefined &&
      reduxUnreadMessages !== 0 ? (
        <Stack orientation="horizontal" spacing="space30">
          Internal Chat
          <Badge as="span" variant="neutral_counter">
            {reduxUnreadMessages >= 99 ? '99+' : reduxUnreadMessages}
          </Badge>
        </Stack>
      ) : (
        <>Internal Chat</>
      )}
    </SideLink>
  );
};

export default SideNavigationIcon;
