import React from 'react';

import * as Flex from '@twilio/flex-ui';
import { FlexPlugin } from '@twilio/flex-plugin';
import {
  CustomizationProvider,
  PasteCustomCSS,
  CustomizationProviderProps,
} from '@twilio-paste/core/customization';

import { namespace, reducers } from './states/index';
import customPasteElements from './utils/customPasteElements';
import SideNavigationIcon from '../src/components/SideNavigation/SideNavigationIcon';
import MainAgentChatView from '../src/components/InternalAgentChat/MainAgentChatView';

const PLUGIN_NAME = 'InternalAgentChatPlugin';

export default class InternalAgentChatPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  async init(flex: typeof Flex, manager: Flex.Manager): Promise<void> {
    manager.store.addReducer?.(namespace, reducers);

    // set Paste theme provider with custom Paste elements
    flex.setProviders({
      CustomProvider: RootComponent =>
        function Provider(props) {
          const pasteProviderProps: CustomizationProviderProps & {
            style: PasteCustomCSS;
          } = {
            // eslint-disable-next-line react/prop-types
            baseTheme: props?.theme?.isLight ? 'default' : 'dark',
            // eslint-disable-next-line react/prop-types
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

    // add Internal Agent Chat icon to Flex Side Navigation
    flex.SideNav.Content.add(
      <SideNavigationIcon
        key="internal-agent-chat-side-nav"
        viewName="internal-agent-chat"
      />,
      {
        sortOrder: 100,
      }
    );

    // add Internal Agent Chat view to Flex ViewCollection
    flex.ViewCollection.Content.add(
      <Flex.View name="internal-agent-chat" key="internal-agent-chat-view">
        <MainAgentChatView
          key="internal-agent-chat-content"
          name="internal-agent-chat-content-view"
        >
          {''}
        </MainAgentChatView>
      </Flex.View>
    );
  }
}
