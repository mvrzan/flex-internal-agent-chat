import moment from 'moment';
import {
  ChatMessage,
  ChatMessageMeta,
  ChatMessageMetaItem,
  ChatBubble,
  ChatBookend,
  ChatBookendItem,
} from '@twilio-paste/core/chat-log';
import { Message } from '../utils/types';

interface GroupedMessagesProps {
  message: Message;
  identity: string;
  prevMessage: Message;
}

const GroupedMessages = ({
  message,
  identity,
  prevMessage,
}: GroupedMessagesProps) => {
  return (
    <>
      {prevMessage !== undefined &&
      moment(message.dateCreated).format('MM/DD/YYYY') !==
        moment(prevMessage?.dateCreated).format('MM/DD/YYYY') &&
      moment(message.dateCreated).format('MM/DD/YYYY') ===
        moment().format('MM/DD/YYYY') ? (
        <>
          <ChatBookend>
            <ChatBookendItem>Today</ChatBookendItem>
          </ChatBookend>
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
      ) : (
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
      )}
    </>
  );
};

export default GroupedMessages;
