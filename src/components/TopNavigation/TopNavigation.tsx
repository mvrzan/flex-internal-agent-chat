import { IconButton, Actions } from '@twilio/flex-ui';
import { ChatBubbleIcon } from '../utils/ChatBubbleIcon';
import { ChatIcon } from '@twilio-paste/icons/esm/ChatIcon';
import { Button, Stack } from '@twilio-paste/core';

const toggleSidePanelHandler = () => {
  // Actions.invokeAction('ToggleSidePanel');
  console.log('test');
};

const TopNavigation = () => {
  // return <IconButton icon="Message" onClick={toggleSidePanelHandler} />;
  return (
    <Stack orientation="horizontal" spacing="space20">
      <Button
        variant="primary_icon"
        size="reset"
        onClick={toggleSidePanelHandler}
      >
        {/* <ChatIcon decorative /> */}
        <ChatBubbleIcon />
      </Button>
    </Stack>
  );
};

export default TopNavigation;
