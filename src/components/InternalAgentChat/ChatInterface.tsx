import { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { Manager } from '@twilio/flex-ui';
import { Box, Stack, Button, Flex, Text, TextArea } from '@twilio-paste/core';
import {
  ChatLog,
  ChatBookend,
  ChatBookendItem,
} from '@twilio-paste/core/chat-log';
import { SendIcon } from '@twilio-paste/icons/esm/SendIcon';
import moment from 'moment';
import { Message, SelectedAgent } from '../utils/types';
import useConversationsClient from '../utils/useConversationsClient';
import GroupedMessages from './GroupedMessages';
import TypingIndicator from './TypingIndicator';
import NewConversationView from './NewConversationView';
import LoadingConversations from './LoadingConversations';
import EmojiInputAction from '../EmojiSupport/EmojiPicker';
import AttachmentButton from '../AttachmentSupport/AttachmentButton';

interface ChatInterfaceProps {
  selectedAgent: SelectedAgent;
}

const ChatInterface = ({ selectedAgent }: ChatInterfaceProps) => {
  const [newMessage, setNewMessage] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [mediaMessages, setMediaMessages] = useState<any>([]);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const inputRef = useRef<null | HTMLTextAreaElement>(null);
  const conversationClient = Manager.getInstance().conversationsClient;
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
    typingIndicator,
  } = useConversationsClient(uniqueName, selectedAgent.contactUri);

  const conversationHandler = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ): void => {
    if (event.target.value === '') {
      setIsButtonDisabled(true);
      setNewMessage('');
    } else {
      instantiatedConversation.typing();
      setNewMessage(event.target.value);
      setIsButtonDisabled(false);
    }
  };

  const enterKeyHandler = (event: KeyboardEvent<HTMLTextAreaElement>): void => {
    if (
      event.code === 'Enter' &&
      !(event.getModifierState('Shift') && event.code === 'Enter')
    ) {
      event.preventDefault();
      sendMessage();
      setIsButtonDisabled(true);
    }
  };

  const sendMessage = async (): Promise<void> => {
    try {
      if (mediaMessages.length !== 0) {
        mediaMessages.forEach(async (message: any) => {
          const newFormattedMessage = new FormData();
          newFormattedMessage.append('file', message);
          await instantiatedConversation.sendMessage(newFormattedMessage);
        });
        setMediaMessages([]);
        setIsButtonDisabled(true);
        return;
      }

      if (newMessage !== '') {
        await instantiatedConversation.sendMessage(newMessage);
        setNewMessage('');
        setIsButtonDisabled(true);
        setMediaMessages([]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      block: 'end',
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [typingIndicator]);

  useEffect(() => {
    scrollToBottom();
    setNewMessage('');
    inputRef.current?.focus();
  }, [conversationMessages, isLoadingMessages]);

  useEffect(() => {
    if (newMessage !== '') {
      setIsButtonDisabled(false);
    }
  }, [newMessage]);

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
              {typingIndicator && (
                <TypingIndicator agentName={selectedAgent.fullName} />
              )}
            </ChatLog>
          )}
        </Box>
      </Flex>
      <Flex grow width="100%" height="150px" vAlignContent="bottom">
        <Box
          borderRadius="borderRadius20"
          objectPosition="bottom"
          position="relative"
          width="100%"
          marginTop="space190"
          marginBottom="space30"
        >
          <TextArea
            ref={inputRef}
            onChange={conversationHandler}
            placeholder={`Message ${selectedAgent.fullName}`}
            value={newMessage}
            onKeyDown={enterKeyHandler}
            element="TEXT_AREA_SIZE"
          />
          <Flex hAlignContent="between" vAlignContent="center" width="100%">
            <Stack orientation="horizontal" spacing="space0">
              <EmojiInputAction setNewMessage={setNewMessage} />
              <AttachmentButton
                setMediaMessages={setMediaMessages}
                setIsButtonDisabled={setIsButtonDisabled}
                sendMessage={sendMessage}
                inputRef={inputRef}
              />
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
