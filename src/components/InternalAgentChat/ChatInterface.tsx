import { ChatComposer } from '@twilio-paste/core/chat-composer';
import { Box, Stack, Button, Flex, Separator, Input } from '@twilio-paste/core';
import {
  ChatLog,
  ChatMessage,
  ChatMessageMeta,
  ChatMessageMetaItem,
  ChatBubble,
  ChatBookend,
  ChatBookendItem,
} from '@twilio-paste/core/chat-log';
import NewConversationView from './NewConversationView';
import { useState } from 'react';
import { conversationClient } from '../utils/conversationsClient';

const ChatInterface = ({ selectedAgent }: any) => {
  const [conversation, setConversation] = useState(true);

  const conversationHandler = async (event: any) => {
    console.log(event.target.value);
    console.log('selectedAgent', selectedAgent);

    const uniqueName = `${selectedAgent.contactUri}+${
      conversationClient.user.identity
    }+${new Date().toJSON().slice(0, 10)}`;

    const conversationAttributes = { testAttribute: 'testAttribute' };
    const friendlyName = 'internal-chat';

    // TODO: Before creating a conversation, first check if an existing conversation already exists by looking at the unique name

    const test = await conversationClient.getConversationByUniqueName(
      uniqueName
    );
    console.log(test);

    // const createdConversation = await conversationClient.createConversation({
    //   attributes: conversationAttributes,
    //   friendlyName,
    //   uniqueName,
    // });
    // console.log(createdConversation);
  };

  return (
    <Flex vertical grow width="100%" height="100%">
      <Flex grow width="100%">
        <Box width="100%" height="100%">
          {conversation ? (
            <NewConversationView selectedAgent={selectedAgent} />
          ) : (
            <ChatLog>
              <ChatMessage variant="inbound">
                <ChatBubble>Ahoy!</ChatBubble>
                <ChatMessageMeta aria-label="said by Gibby Radki 4 minutes ago">
                  <ChatMessageMetaItem>
                    Gibby Radki ・ 4 minutes ago
                  </ChatMessageMetaItem>
                </ChatMessageMeta>
              </ChatMessage>
              <ChatMessage variant="outbound">
                <ChatBubble>Howdy!</ChatBubble>
                <ChatMessageMeta aria-label="said by you 2 minutes ago">
                  <ChatMessageMetaItem>2 minutes ago</ChatMessageMetaItem>
                </ChatMessageMeta>
                <ChatMessageMeta aria-label="(read)">
                  <ChatMessageMetaItem>Read</ChatMessageMetaItem>
                </ChatMessageMeta>
              </ChatMessage>
            </ChatLog>
          )}
        </Box>
      </Flex>
      <Flex grow width="100%" height="100%" vAlignContent="bottom">
        <Box
          borderRadius="borderRadius20"
          borderColor="colorBorderPrimaryWeak"
          borderStyle="solid"
          borderWidth="borderWidth20"
          objectPosition="bottom"
          position="relative"
          width="100%"
          marginTop="space190"
          marginBottom="space0"
          paddingBottom="space0"
        >
          <Input type="text" onChange={conversationHandler} />
          {/* <ChatComposer
            ariaLabel="Message"
            placeholder="Chat text"
            maxHeight="size10"
            config={{
              namespace: 'customer-chat',
              onError(e) {
                throw e;
              },
            }}
          /> */}
        </Box>
      </Flex>
    </Flex>
  );
};

export default ChatInterface;
