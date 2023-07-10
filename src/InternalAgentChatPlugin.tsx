import React from 'react';
import * as Flex from '@twilio/flex-ui';
import { FlexPlugin } from '@twilio/flex-plugin';
import { CustomizationProvider } from '@twilio-paste/core/customization';
import SideNavigationIcon from '../src/components/SideNavigation/SideNavigationIcon';
import { View } from '@twilio/flex-ui';
import InternalAgentChat from '../src/components/InternalAgentChat/InternalAgentChat';
import ChatDialog from '../src/components/ChatDialog/ChatDialog';

const PLUGIN_NAME = 'InternalAgentChatPlugin';

export default class InternalAgentChatPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  async init(flex: typeof Flex, manager: Flex.Manager): Promise<void> {
    flex.setProviders({
      PasteThemeProvider: CustomizationProvider,
    });

    flex.MainHeader.Content.add(<ChatDialog key="internal-chat" />, {
      sortOrder: -999,
      align: 'end',
    });

    flex.SideNav.Content.add(
      <SideNavigationIcon
        key="internal-agent-chat-side-nav"
        viewName="internal-agent-chat"
      />,
      {
        sortOrder: 100,
      }
    );

    flex.ViewCollection.Content.add(
      <View name="internal-agent-chat" key="internal-agent-chat-view">
        <InternalAgentChat key="internal-agent-chat-content" />
      </View>
    );
  }
}
