import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Badge, Stack } from '@twilio-paste/core';
import { SideLink, Actions } from '@twilio/flex-ui';

import { AppState, namespace } from '../../states';
import usePinnedChats from '../../utils/usePinnedChats';
import MessageIconWithBadge from './MessageIconWithBadge';
import useSubscribedConversations from '../../utils/useSubscribedConversations';

interface SideNavigationProps {
  activeView?: string;
  viewName: string;
}

const SideNavigationIcon = ({ activeView, viewName }: SideNavigationProps) => {
  const [currentView, setCurrentView] = useState('');
  usePinnedChats(currentView);
  useSubscribedConversations(activeView);

  useEffect(() => {
    setCurrentView(activeView!);
  }, [activeView]);

  const navigateHandler = () => {
    Actions.invokeAction('NavigateToView', {
      viewName: viewName,
    });
  };

  const reduxUnreadMessages = useSelector(
    (state: AppState) =>
      state[namespace]?.customInternalChat?.unreadMessagesNumber
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
