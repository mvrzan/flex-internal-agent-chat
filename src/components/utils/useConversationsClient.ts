import * as Flex from '@twilio/flex-ui';
import { Conversation } from '@twilio/conversations';
import { useState, useEffect } from 'react';
import { SetStateAction } from 'react';

interface ConversationMessage {
  author: string | null;
  sid: string | undefined;
  body: string | null;
  dateCreated: string | undefined;
  attributes: string | undefined;
  type: string | undefined;
}

const useConversationsClient = (uniqueName: string) => {
  console.log('customHook!!!');
  const [conversationMessages, setConversationMessages] = useState<any>([{}]);
  //   const [conversationMessages, setConversationMessages] =
  //     useState<ConversationMessage[]>();
  const [instantiatedConversation, setInstantiatedConversation] =
    useState<any>();
  const conversationClient = Flex.Manager.getInstance().conversationsClient;

  try {
    const getConversation = async (uniqueName: string) => {
      const fetchedConversation: Conversation =
        await conversationClient.getConversationByUniqueName(uniqueName);

      if (fetchedConversation !== null) {
        fetchedConversation.status === 'notParticipating' &&
          (await fetchedConversation.join());
        fetchedConversation.setAllMessagesRead();
        fetchedConversation.removeAllListeners();

        // when the messages gets updated, update the messageList state
        fetchedConversation.on('messageUpdated', updatedMessage => {
          console.log('messageUpdated');
          setConversationMessages(
            (prevState: SetStateAction<ConversationMessage[] | undefined>) => {
              if (prevState !== undefined) {
                // @ts-ignore
                return prevState.map((prevMessage: ConversationMessage) =>
                  prevMessage.sid === updatedMessage.message.sid
                    ? updatedMessage.message
                    : prevMessage
                );
              }
            }
          );
        });

        // when the messages gets added, update the messageList state
        fetchedConversation.on('messageAdded', async message => {
          console.log('messageAdded');
          // const mediaUrl =
          // message.type === "media" ? await message.attachedMedia : "";
          // const mediaType = message.type === "media" ? message.attachedMedia : "";
          const author = message.author;
          const sid = message.sid;
          const body = message.body;
          const updatedMessage: ConversationMessage = {
            ...message,
            // mediaUrl,
            // mediaType,
            author,
            sid,
            body,
            dateCreated: '',
            attributes: '',
            type: '',
          };
          setConversationMessages(
            (prevState: ConversationMessage[] | undefined) => {
              if (prevState !== undefined) {
                return [...prevState, updatedMessage];
              } else {
                return [updatedMessage];
              }
            }
          );
        });

        // const res = await fetchedConversation.sendMessage('test');
        // console.log(res);
        setInstantiatedConversation(fetchedConversation);

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

        setConversationMessages(messages);
        return { conversationMessages, instantiatedConversation };
      }
    };

    getConversation(uniqueName);

    if (conversationMessages !== undefined) {
      return { conversationMessages, instantiatedConversation };
    } else {
      return {};
    }
    // return { conversationMessages, instantiatedConversation };
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Not Found') {
        console.warn(
          'The conversation was not found; creating a new conversation with uniqueName:',
          uniqueName
        );
        // Create a new Conversation since one does not exist
        try {
          const createNewConversation = async () => {
            const newConversation = await conversationClient.createConversation(
              {
                attributes: { testAttribute: 'testAttribute' },
                friendlyName: 'internal-chat',
                uniqueName,
              }
            );

            console.log('Conversation successfully created');
          };
          createNewConversation();
        } catch (error) {
          // Catch and log an error in case we can't create a new Conversation
          console.error(
            'There was a problem creating a new conversation!',
            error
          );
        }
      }
    }
  }
};

export default useConversationsClient;
