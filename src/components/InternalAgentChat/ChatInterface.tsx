import { ChatComposer } from '@twilio-paste/core/chat-composer';
import { Box } from '@twilio-paste/core';
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
      <ChatComposer
        config={{
          namespace: 'customer-chat',
          onError: e => {
            throw e;
          },
        }}
        ariaLabel="A basic chat composer"
        placeholder="Chat text"
      />
    </>
  );
};

export default ChatInterface;
