import { Icon } from '@twilio/flex-ui';
import { useSelector } from 'react-redux';
import { Badge } from '@twilio-paste/core';
import { namespace, AppState } from '../../states';

interface MessageIconWithBadgeProps {
  activeView?: string;
  viewName: string;
}

const MessageIconWithBadge = ({
  activeView,
  viewName,
}: MessageIconWithBadgeProps) => {
  const reduxUnreadMessages = useSelector(
    (state: AppState) => state[namespace].customInternalChat.unreadMessages
  );

  return (
    <>
      {reduxUnreadMessages !== null &&
      reduxUnreadMessages !== undefined &&
      reduxUnreadMessages !== 0 ? (
        <>
          {activeView === viewName ? (
            <Icon icon="MessageBold" />
          ) : (
            <Icon icon="Message" />
          )}
          <Badge
            as="span"
            variant="neutral_counter"
            element="BADGE_PINNED_CHATS"
          >
            {reduxUnreadMessages >= 99 ? '99+' : reduxUnreadMessages}
          </Badge>
        </>
      ) : (
        <>
          {activeView === viewName ? (
            <Icon icon="MessageBold" />
          ) : (
            <Icon icon="Message" />
          )}
        </>
      )}
    </>
  );
};

export default MessageIconWithBadge;
