import React from 'react';
import { useSelector } from 'react-redux';
import { Stack } from '@twilio-paste/core/stack';
import { Badge } from '@twilio-paste/core/badge';
import { SideLink, Actions } from '@twilio/flex-ui';

import { AppState, namespace } from '../../states';
import usePinnedChats from '../../hooks/usePinnedChats';
import MessageIconWithBadge from './MessageIconWithBadge';
import useSubscribedConversations from '../../hooks/useSubscribedConversations';

interface SideNavigationProps {
  activeView?: string;
  viewName: string;
}

const SideNavigationIcon = ({ activeView, viewName }: SideNavigationProps) => {
  usePinnedChats(activeView);
  useSubscribedConversations(activeView);

  const navigateHandler = async () => {
    try {
      await Actions.invokeAction('NavigateToView', {
        viewName: viewName,
      });
    } catch (error) {
      console.error(error);
    }
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
