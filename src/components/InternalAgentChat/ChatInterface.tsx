import { Box, Stack, Button, Flex, Text, TextArea } from '@twilio-paste/core';
import {
  ChatLog,
  ChatBookend,
  ChatBookendItem,
} from '@twilio-paste/core/chat-log';
import NewConversationView from './NewConversationView';
import { useState, useEffect, useRef } from 'react';
import { conversationClient } from '../utils/conversationsClient';
import { SendIcon } from '@twilio-paste/icons/esm/SendIcon';
import useConversationsClient from '../utils/useConversationsClient';
import moment from 'moment';
import GroupedMessages from './GroupedMessages';
import { EmojiIcon } from '@twilio-paste/icons/esm/EmojiIcon';
import { Message, SelectedAgent } from '../utils/types';
import LoadingConversations from './LoadingConversations';
import AttachmentButton from './AttachmentButton';

interface ChatInterfaceProps {
  selectedAgent: SelectedAgent;
}

const ChatInterface = ({ selectedAgent }: ChatInterfaceProps) => {
  const [newMessage, setNewMessage] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const uniqueName: string = [
    selectedAgent.contactUri,
    conversationClient.user.identity,
  ]
    .sort()
    .join('+');
  const {
    conversationMessages,
    instantiatedConversation,
    isEmpty,
    isLoadingMessages,
  } = useConversationsClient(uniqueName, selectedAgent.contactUri);

  const conversationHandler = async (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    if (event.target.value === '') {
      setIsButtonDisabled(true);
      setNewMessage('');
    } else {
      setNewMessage(event.target.value);
      setIsButtonDisabled(false);
    }
  };

  const sendMessage = async (): Promise<void> => {
    try {
      await instantiatedConversation.sendMessage(newMessage);
      setNewMessage('');
    } catch (error) {
      console.error(error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
  };

  useEffect(() => {
    scrollToBottom();
    setNewMessage('');
  }, [conversationMessages, isLoadingMessages]);

  return (
    <Flex vertical width="100%" height="100%">
      <Flex element="FLEX_WITH_OVERFLOW" width="100%" height="5000px">
        <Box width="100%">
          {isLoadingMessages ? (
            <LoadingConversations />
          ) : isEmpty ? (
            <NewConversationView selectedAgent={selectedAgent} />
          ) : (
            <ChatLog ref={messagesEndRef}>
              <ChatBookend>
                <ChatBookendItem>
                  <Text as="span" fontWeight="fontWeightBold">
                    Chat Started
                  </Text>
                  ・
                  {moment(conversationMessages[0].dateCreated).format(
                    'MM/DD/YYYY, h:mm:ss a'
                  )}
                </ChatBookendItem>
                <ChatBookendItem>Previous messages</ChatBookendItem>
              </ChatBookend>
              {conversationMessages?.map((message: Message, index: number) => {
                return (
                  <GroupedMessages
                    key={message.sid}
                    message={message}
                    prevMessage={conversationMessages[index - 1]}
                    identity={conversationClient.user.identity}
                  />
                );
              })}
            </ChatLog>
          )}
        </Box>
      </Flex>
      <Flex grow width="100%" height="100%" vAlignContent="bottom">
        <Box
          borderRadius="borderRadius20"
          objectPosition="bottom"
          position="relative"
          width="100%"
          marginTop="space190"
          marginBottom="space30"
        >
          <TextArea
            onChange={conversationHandler}
            placeholder={`Message ${selectedAgent.fullName}`}
            value={newMessage}
          />
          <Flex hAlignContent="between" vAlignContent="center" width="100%">
            <Stack orientation="horizontal" spacing="space0">
              <Button
                variant="secondary_icon"
                onClick={() => {
                  console.log('The button does nothing at the moment!');
                }}
              >
                <EmojiIcon decorative={false} title="emoji" />
              </Button>
              <AttachmentButton />
            </Stack>
            <Button
              variant="primary_icon"
              onClick={sendMessage}
              disabled={isButtonDisabled}
            >
              <SendIcon decorative={false} size="sizeIcon20" title="send" />
            </Button>
          </Flex>
        </Box>
      </Flex>
    </Flex>
  );
};

export default ChatInterface;
