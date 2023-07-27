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
import {
  conversationClient,
  getConversationByUniqueName,
} from '../utils/conversationsClient';
import { Conversation } from '@twilio/conversations';

const ChatInterface = ({ selectedAgent }: any) => {
  const [conversation, setConversation] = useState(true);
  const [messageList, setMessageList] = useState<any>([{}]);
  const [chat, setChat] = useState<any>();

  const conversationHandler = async (event: any) => {
    const uniqueName = `${selectedAgent.contactUri}+${
      conversationClient.user.identity
    }+${new Date().toJSON().slice(0, 10)}`;
    const conversationAttributes = { testAttribute: 'testAttribute' };
    const friendlyName = 'internal-chat';

    // TODO: Before creating a conversation, first check if an existing conversation already exists by looking at the unique name
    try {
      const fetchedConversation = await getConversationByUniqueName(uniqueName);

      if (fetchedConversation !== null) {
        fetchedConversation.setAllMessagesRead();
        fetchedConversation.removeAllListeners();
        fetchedConversation.on('messageUpdated', message => {
          const newMessage = message.message;
          setMessageList((prevState: any[]) =>
            prevState.map(o => (o.sid == newMessage.sid ? newMessage : o))
          );
        });

        fetchedConversation.on('messageAdded', async message => {
          // const mediaUrl =
          // message.type === "media" ? await message.attachedMedia : "";
          // const mediaType = message.type === "media" ? message.attachedMedia : "";
          const author = message.author;
          const sid = message.sid;
          const body = message.body;
          const updatedMessage = {
            ...message,
            // mediaUrl,
            // mediaType,
            author,
            sid,
            body,
          };
          setMessageList((prevState: any[]) => [...prevState, updatedMessage]);
          console.log(updatedMessage);
        });
        setChat(fetchedConversation);

        //3. Load messages
        const paginator = await fetchedConversation.getMessages(1000);
        const messages = await Promise.all(
          paginator.items.map(async s => {
            // const mediaUrl =
            //   s.type === "media" ? await s.media.getContentTemporaryUrl() : "";
            // const mediaType = s.type === "media" ? s.media.contentType : "";
            return {
              author: s.author,
              sid: s.sid,
              body: s.body,
              dateCreated: s.dateCreated,
              attributes: s.attributes,
              type: s.type,
              // mediaUrl,
              // mediaType,
            };
          })
        );

        console.log(messages);
        setMessageList(messages);
        chat.sendMessage(event.target.value);
      } else {
        console.log('The conversation is null');
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }

      try {
        const createdConversation = await conversationClient.createConversation(
          {
            attributes: conversationAttributes,
            friendlyName,
            uniqueName,
          }
        );
        console.log(createdConversation);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <Flex vertical grow width="100%" height="100%">
      <Flex grow width="100%">
        <Box width="100%" height="100%">
          {conversation ? (
            <NewConversationView selectedAgent={selectedAgent} />
          ) : (
            <>
              {}
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
            </>
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
