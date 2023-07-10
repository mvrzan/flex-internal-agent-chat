import { SideLink, Actions, Icon } from '@twilio/flex-ui';

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
      icon={<Icon icon="Message" />}
      iconActive={<Icon icon="MessageBold" />}
      onClick={navigateHandler}
      isActive={activeView === viewName}
      key="InternalAgentChat"
    >
      Agent-to-Agent Chat
    </SideLink>
  );
};

export default SideNavigationIcon;
