import { ChatComposer } from '@twilio-paste/core/chat-composer';
import { Box, Stack, Button } from '@twilio-paste/core';
import {
  ChatLog,
  ChatMessage,
  ChatMessageMeta,
  ChatMessageMetaItem,
  ChatBubble,
  ChatBookend,
  ChatBookendItem,
} from '@twilio-paste/core/chat-log';
import { SendIcon } from '@twilio-paste/icons/esm/SendIcon';

const ChatInterface = () => {
  return (
    <>
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
      <Box
        display="table-row"
        vertical-align="bottom"
        height="1px"
        borderRadius="borderRadius20"
        borderColor="colorBorderPrimaryWeak"
        borderStyle="solid"
        borderWidth="borderWidth20"
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
    </>
  );
};

export default ChatInterface;
