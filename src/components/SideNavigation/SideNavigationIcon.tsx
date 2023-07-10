import { SideLink, Actions, Icon } from '@twilio/flex-ui';
import { ChatBubbleIconFilled, ChatBubbleIcon } from '../utils/ChatBubbleIcon';

interface SideNavigationProps {
  activeView?: string;
  viewName: string;
}

const SideNavigationIcon = ({ activeView, viewName }: SideNavigationProps) => {
  const navigateHandler = () => {
    Actions.invokeAction('NavigateToView', {
      viewName: viewName,
    });
  };

  return (
    <SideLink
      showLabel
      icon={<ChatBubbleIcon />}
      iconActive={<ChatBubbleIconFilled />}
      onClick={navigateHandler}
      isActive={activeView === viewName}
      key="InternalAgentChat"
    >
      Agent-to-Agent Chat
    </SideLink>
  );
};

export default SideNavigationIcon;
