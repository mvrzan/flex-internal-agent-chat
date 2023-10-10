import React from 'react';
import * as Flex from '@twilio/flex-ui';
import { FlexPlugin } from '@twilio/flex-plugin';
import SideNavigationIcon from '../src/components/SideNavigation/SideNavigationIcon';
import { View } from '@twilio/flex-ui';
import MainAgentChatView from '../src/components/InternalAgentChat/MainAgentChatView';
import ChatDialog from '../src/components/ChatDialog/ChatDialog';
import {
  CustomizationProvider,
  PasteCustomCSS,
  CustomizationProviderProps,
} from '@twilio-paste/core/customization';
import { namespace, reducers } from './states/index';
import customPasteElements from './utils/customPasteElements';

const PLUGIN_NAME = 'InternalAgentChatPlugin';

export default class InternalAgentChatPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  async init(flex: typeof Flex, manager: Flex.Manager): Promise<void> {
    manager.store.addReducer?.(namespace, reducers);

    flex.setProviders({
      CustomProvider: RootComponent => props => {
        const pasteProviderProps: CustomizationProviderProps & {
          style: PasteCustomCSS;
        } = {
          baseTheme: props.theme?.isLight ? 'default' : 'dark',
          theme: props.theme?.tokens,
          style: { minWidth: '100%', height: '100%' },
          elements: { ...customPasteElements },
        };
        return (
          <CustomizationProvider {...pasteProviderProps}>
            <RootComponent {...props} />
          </CustomizationProvider>
        );
      },
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
        <MainAgentChatView key="internal-agent-chat-content" />
      </View>
    );
  }
}
