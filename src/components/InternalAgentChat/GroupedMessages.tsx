import React from 'react';
import {
  ChatMessage,
  ChatMessageMeta,
  ChatMessageMetaItem,
  ChatBubble,
  ChatBookend,
  ChatBookendItem,
} from '@twilio-paste/core/chat-log';
import { Message } from '../../utils/types';
import MediaMessage from '../MediaSupport/MediaMessage';
import { dateFormatter, dateStringFormatter } from '../../utils/dateHandler';

interface GroupedMessagesProps {
  message: Message;
  identity: string;
  prevMessage: Message;
}

//TODO: Clean the logic here. There are some DRY patterns
const GroupedMessages = ({
  message,
  identity,
  prevMessage,
}: GroupedMessagesProps) => {
  const today = new Date();
  const formattedToday = today.toLocaleDateString();

  return (
    <>
      {prevMessage !== undefined &&
      dateStringFormatter(message.dateCreated) !==
        dateStringFormatter(prevMessage?.dateCreated) &&
      dateStringFormatter(message.dateCreated) === formattedToday ? (
        <>
          <ChatBookend>
            <ChatBookendItem>Today</ChatBookendItem>
          </ChatBookend>
          <ChatMessage
            variant={message.author === identity ? 'outbound' : 'inbound'}
          >
            {message.mediaType !== '' && message.mediaUrl !== '' && (
              <div
                style={{
                  alignItems: `${
                    message.author === identity ? 'end' : 'start'
                  }`,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <MediaMessage
                  mediaUrl={message.mediaUrl}
                  mediaType={message.mediaType}
                />
                <ChatMessageMeta aria-label={`chat-message-${message.author}`}>
                  <ChatMessageMetaItem>
                    {message.author} ・ {dateFormatter(message.dateCreated)}
                  </ChatMessageMetaItem>
                </ChatMessageMeta>
              </div>
            )}
            {message.body !== '' && message.body !== null && (
              <>
                <ChatBubble key={message.sid}>{message.body}</ChatBubble>
                <ChatMessageMeta aria-label={`chat-message-${message.author}`}>
                  <ChatMessageMetaItem>
                    {message.author} ・ {dateFormatter(message.dateCreated)}
                  </ChatMessageMetaItem>
                </ChatMessageMeta>
              </>
            )}
          </ChatMessage>
        </>
      ) : (
        <ChatMessage
          variant={message.author === identity ? 'outbound' : 'inbound'}
        >
          {message.mediaType !== '' && message.mediaUrl !== '' && (
            <div
              style={{
                alignItems: `${message.author === identity ? 'end' : 'start'}`,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <MediaMessage
                mediaUrl={message.mediaUrl}
                mediaType={message.mediaType}
              />
              <ChatMessageMeta aria-label={`chat-message-${message.author}`}>
                <ChatMessageMetaItem>
                  {message.author} ・ {dateFormatter(message.dateCreated)}
                </ChatMessageMetaItem>
              </ChatMessageMeta>
            </div>
          )}
          {message.body !== '' && message.body !== null && (
            <>
              <ChatBubble key={message.sid}>{message.body}</ChatBubble>
              <ChatMessageMeta aria-label={`chat-message-${message.author}`}>
                <ChatMessageMetaItem>
                  {message.author} ・ {dateFormatter(message.dateCreated)}
                </ChatMessageMetaItem>
              </ChatMessageMeta>
            </>
          )}
        </ChatMessage>
      )}
    </>
  );
};

export default GroupedMessages;
