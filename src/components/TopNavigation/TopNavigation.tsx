import { IconButton } from '@twilio/flex-ui';

const toggleSidePanelHandler = () => {
  // Actions.invokeAction('ToggleSidePanel');
  console.log('test');
};
const TopNavigation = () => (
  <IconButton icon="Message" onClick={toggleSidePanelHandler} />
);

export default TopNavigation;
