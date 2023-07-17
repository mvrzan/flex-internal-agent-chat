import { ChatComposer } from '@twilio-paste/core/chat-composer';
import { Box, Stack, Button, Flex, Separator } from '@twilio-paste/core';
import {
  ChatLog,
  ChatMessage,
  ChatMessageMeta,
  ChatMessageMetaItem,
  ChatBubble,
  ChatBookend,
  ChatBookendItem,
} from '@twilio-paste/core/chat-log';

const ChatInterface = () => {
  return (
    <Flex vertical grow width="100%" height="90%">
      <Flex grow width="100%">
        <Box width="100%" height="100%" marginBottom="space190">
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
          <ChatComposer
            ariaLabel="Message"
            placeholder="Chat text"
            maxHeight="size10"
            config={{
              namespace: 'customer-chat',
              onError(e) {
                throw e;
              },
            }}
          />
        </Box>
      </Flex>
    </Flex>
  );
};

export default ChatInterface;
