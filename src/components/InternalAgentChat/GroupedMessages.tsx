import moment from 'moment';
import {
  ChatLog,
  ChatMessage,
  ChatMessageMeta,
  ChatMessageMetaItem,
  ChatBubble,
  ChatBookend,
  ChatBookendItem,
} from '@twilio-paste/core/chat-log';

interface GroupedMessagesProps {
  message: any;
  identity: string;
}

const GroupedMessages = ({ message, identity }: GroupedMessagesProps) => {
  return (
    <>
      <ChatMessage
        variant={message.author === identity ? 'outbound' : 'inbound'}
      >
        <ChatBubble key={message.sid}>{message.body}</ChatBubble>
        <ChatMessageMeta aria-label={`chat-message-${message.author}`}>
          <ChatMessageMetaItem>
            {message.author} ・{' '}
            {moment(message.dateCreated).format('MM/DD/YYYY, h:mm:ss a')}
          </ChatMessageMetaItem>
        </ChatMessageMeta>
      </ChatMessage>
    </>
  );
};

export default GroupedMessages;
