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
import { SendIcon } from '@twilio-paste/icons/esm/SendIcon';
import { Fragment } from 'react';
import useConversationsClient from '../utils/useConversationsClient';
import moment from 'moment';

const ChatInterface = ({ selectedAgent }: any) => {
  const [newMessage, setNewMessage] = useState('');
  const [inputValue, setInputValue] = useState('');
  const uniqueName = `${selectedAgent.contactUri}+${conversationClient.user.identity}`;
  const { conversationMessages, instantiatedConversation, isEmpty } =
    useConversationsClient(uniqueName);

  const conversationHandler = async (event: any) => {
    setNewMessage(event.target.value);
    setInputValue(event.target.value);
  };

  const sendMessage = async () => {
    try {
      await instantiatedConversation.sendMessage(newMessage);
      setInputValue('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Flex vertical grow width="100%" height="100%">
      <Flex grow width="100%">
        <Box width="100%" height="100%">
          {isEmpty ? (
            <NewConversationView selectedAgent={selectedAgent} />
          ) : (
            <ChatLog>
              {conversationMessages?.map((message: any) => {
                return (
                  <Fragment>
                    <ChatMessage
                      variant={
                        message.author === conversationClient.user.identity
                          ? 'outbound'
                          : 'inbound'
                      }
                    >
                      <ChatBubble key={message.sid}>{message.body}</ChatBubble>
                      <ChatMessageMeta
                        aria-label={`chat-message-${message.author}`}
                      >
                        <ChatMessageMetaItem>
                          {message.author} ・{' '}
                          {moment(message.dateCreated).format(
                            'MM/DD/YYYY, h:mm:ss a'
                          )}
                        </ChatMessageMetaItem>
                      </ChatMessageMeta>
                    </ChatMessage>
                  </Fragment>
                );
              })}
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
          <Input
            type="text"
            value={inputValue}
            onChange={conversationHandler}
            insertAfter={
              <Button variant="primary_icon" onClick={sendMessage}>
                <SendIcon decorative={false} size="sizeIcon20" title="send" />
              </Button>
            }
          />
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
            onChange={conversationHandler}
          /> */}
        </Box>
      </Flex>
    </Flex>
  );
};

export default ChatInterface;
