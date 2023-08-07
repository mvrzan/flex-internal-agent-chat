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
import { useEffect, useState } from 'react';
import {
  conversationClient,
  getConversationByUniqueName,
} from '../utils/conversationsClient';
import { SendIcon } from '@twilio-paste/icons/esm/SendIcon';
import { Fragment } from 'react';
import useConversationsClient from '../utils/useConversationsClient';

const ChatInterface = ({ selectedAgent }: any) => {
  const [isConversationEmpty, setIsConversationEmpty] = useState(true);
  const [messageList, setMessageList] = useState<any>([{}]);
  const [chat, setChat] = useState<any>();
  const [newMessage, setNewMessage] = useState('');
  const [inputValue, setInputValue] = useState('');
  const uniqueName = `${selectedAgent.contactUri}+${
    conversationClient.user.identity
  }+${new Date().toJSON().slice(0, 10)}`;

  const { conversationMessages, instantiatedConversation } =
    useConversationsClient(uniqueName);

  useEffect(() => {
    conversationMessages && conversationMessages.length > 0
      ? setIsConversationEmpty(false)
      : setIsConversationEmpty(true);
  }, [instantiatedConversation, selectedAgent.contactUri]);

  // useEffect(() => {
  //   const getConversation = async () => {
  //     const uniqueName = `${selectedAgent.contactUri}+${
  //       conversationClient.user.identity
  //     }+${new Date().toJSON().slice(0, 10)}`;
  //     try {
  //       const fetchedConversation =
  //         await conversationClient.getConversationByUniqueName(uniqueName);

  //       if (fetchedConversation !== null) {
  //         fetchedConversation.status === 'notParticipating' &&
  //           (await fetchedConversation.join());
  //         fetchedConversation.setAllMessagesRead();
  //         fetchedConversation.removeAllListeners();

  //         // when the messages gets updated, update the messageList state
  //         fetchedConversation.on('messageUpdated', updatedMessage => {
  //           console.log('messageUpdated');
  //           setMessageList((prevState: any[]) =>
  //             prevState.map(prevMessage =>
  //               prevMessage.sid === updatedMessage.message.sid
  //                 ? updatedMessage.message
  //                 : prevMessage
  //             )
  //           );
  //         });

  //         // when the messages gets added, update the messageList state
  //         fetchedConversation.on('messageAdded', async message => {
  //           console.log('messageAdded');
  //           // const mediaUrl =
  //           // message.type === "media" ? await message.attachedMedia : "";
  //           // const mediaType = message.type === "media" ? message.attachedMedia : "";
  //           const author = message.author;
  //           const sid = message.sid;
  //           const body = message.body;
  //           const updatedMessage = {
  //             ...message,
  //             // mediaUrl,
  //             // mediaType,
  //             author,
  //             sid,
  //             body,
  //           };
  //           setMessageList((prevState: any[]) => [
  //             ...prevState,
  //             updatedMessage,
  //           ]);
  //           console.log(updatedMessage);
  //         });
  //         // const res = await fetchedConversation.sendMessage('test');
  //         // console.log(res);
  //         setChat(fetchedConversation);

  //         //3. Load messages
  //         const paginator = await fetchedConversation.getMessages(1000);
  //         const messages = await Promise.all(
  //           paginator.items.map(async s => {
  //             // const mediaUrl =
  //             //   s.type === "media" ? await s.media.getContentTemporaryUrl() : "";
  //             // const mediaType = s.type === "media" ? s.media.contentType : "";
  //             return {
  //               author: s.author,
  //               sid: s.sid,
  //               body: s.body,
  //               dateCreated: s.dateCreated,
  //               attributes: s.attributes,
  //               type: s.type,
  //               // mediaUrl,
  //               // mediaType,
  //             };
  //           })
  //         );

  //         setMessageList(messages);

  //         messages.length > 0
  //           ? setIsConversationEmpty(false)
  //           : setIsConversationEmpty(true);

  //         return fetchedConversation;
  //       }
  //     } catch (error) {
  //       if (error instanceof Error) {
  //         if (error.message === 'Not Found') {
  //           console.warn(
  //             'The conversation was not found; creating a new conversation with uniqueName:',
  //             uniqueName
  //           );
  //           await conversationClient.createConversation({
  //             attributes: { testAttribute: 'testAttribute' },
  //             friendlyName: 'internal-chat',
  //             uniqueName,
  //           });
  //         }
  //       }
  //     }
  //   };
  //   const fetchedConversation = getConversation();

  //   // return () => {
  //   //   const leaveConversation = async () => {
  //   //     const conversation = await fetchedConversation;
  //   //     conversation?.removeAllListeners();
  //   //     // conversationClient.removeAllListeners();
  //   //     console.log('removingAllListeners');
  //   //   };
  //   //   leaveConversation();
  //   // };
  // }, [chat, selectedAgent.contactUri]);

  const conversationHandler = async (event: any) => {
    setNewMessage(event.target.value);
    setInputValue(event.target.value);
  };

  const sendMessage = async () => {
    try {
      // await chat.sendMessage(newMessage);
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
          {isConversationEmpty ? (
            <NewConversationView selectedAgent={selectedAgent} />
          ) : (
            <ChatLog>
              {conversationMessages?.map((message: any) => {
                return (
                  <Fragment key={message.sid}>
                    <ChatMessage
                      variant={
                        message.author === conversationClient.user.identity
                          ? 'outbound'
                          : 'inbound'
                      }
                    >
                      <ChatBubble>{message.body}</ChatBubble>
                      <ChatMessageMeta
                        aria-label={`chat-message-${message.author}`}
                      >
                        <ChatMessageMetaItem>
                          {message.author} ・ 4 minutes ago
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
