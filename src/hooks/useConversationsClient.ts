import * as Flex from '@twilio/flex-ui';
import { Conversation } from '@twilio/conversations';
import { useState, useEffect } from 'react';
import { Message } from '../utils/types';
import { useDispatch } from 'react-redux';
import { actions } from '../states';
import { UnreadMessagesPayload } from '../states/CustomInternalChatState';

interface ConversationMessage {
  author: string | null;
  sid: string | undefined;
  body: string | null;
  dateCreated: Date | null;
  attributes: string | undefined;
  type: string | undefined;
  mediaUrl: string | null;
  mediaType: string | null;
}

const useConversationsClient = (
  uniqueName: string,
  selectedAgentIdentity: string
) => {
  const [typingIndicator, setTypingIndicator] = useState<boolean>(false);
  const [conversationMessages, setConversationMessages] = useState<Message[]>(
    []
  );
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [instantiatedConversation, setInstantiatedConversation] =
    useState<Conversation>();
  const conversationClient = Flex.Manager.getInstance().conversationsClient;
  const workerInitiatingConversation = conversationClient.user.identity;
  const dispatch = useDispatch();

  const updateUnreadMessageCounter = (
    unreadMessagesNumber: UnreadMessagesPayload
  ) => dispatch(actions.customInternalChat.updateCounter(unreadMessagesNumber));

  useEffect(() => {
    let hookInvoked = true;
    let conversationReference: Conversation | undefined;

    const getInstantiatedConversation = async (
      uniqueName: string
    ): Promise<Conversation | undefined> => {
      try {
        const fetchedConversation: Conversation =
          await conversationClient.getConversationByUniqueName(uniqueName);
        setInstantiatedConversation(fetchedConversation);

        return fetchedConversation;
      } catch (error) {
        if (error instanceof Error) {
          if (error.message === 'Not Found') {
            console.warn(
              'The conversation was not found; creating a new conversation with uniqueName:',
              uniqueName
            );
            try {
              // Create a new Conversation since one does not exist
              const createNewConversation = async () => {
                const newConversation =
                  await conversationClient.createConversation({
                    attributes: { internalChat: 'internalChat' },
                    friendlyName: 'internal-chat',
                    uniqueName,
                  });
                console.log('Conversation successfully created');
                setInstantiatedConversation(newConversation);

                await newConversation.add(workerInitiatingConversation);
                console.log(
                  `${workerInitiatingConversation} successfully added to the conversation!`
                );

                await newConversation.add(selectedAgentIdentity);
                console.log(
                  `${selectedAgentIdentity} successfully added to the conversation!`
                );
                return newConversation;
              };

              return createNewConversation();
            } catch (error) {
              // Catch and log an error in case we can't create a new Conversation
              console.error(
                'There was a problem creating a new conversation!',
                error
              );
              return undefined;
            }
          }
        }
      }
    };

    const getConversation = async (fetchedConversation: Conversation) => {
      try {
        fetchedConversation.setAllMessagesRead();
        fetchedConversation.removeAllListeners();
        setConversationMessages([]);

        const reduxPayloadUnreadMessage = {
          unreadMessagesNumber: 0,
          conversationUniqueName: fetchedConversation.uniqueName,
        };

        updateUnreadMessageCounter(reduxPayloadUnreadMessage);

        // when the messages gets updated, update the conversationMessages state
        fetchedConversation.on('messageUpdated', updatedMessage => {
          console.log('messageUpdated');
          setConversationMessages((prevState: Message[]) => {
            if (prevState instanceof Array) {
              return prevState.map(prevMessage =>
                prevMessage.sid === updatedMessage.message.sid
                  ? updatedMessage.message
                  : prevMessage
              ) as Message[]; // Explicitly cast the return value to Message[]
            }
            return [];
          });
        });

        // when the messages gets added, update the conversationMessages state
        fetchedConversation.on('messageAdded', async message => {
          console.log('messageAdded');
          const mediaUrl =
            message.type === 'media' && message.media !== null
              ? await message.media.getContentTemporaryUrl()
              : '';
          const mediaType =
            message.type === 'media' && message.media !== null
              ? message.media.contentType
              : '';
          const author = message.author;
          const sid = message.sid;
          const body = message.body;
          const updatedMessage: ConversationMessage = {
            ...message,
            mediaUrl,
            mediaType,
            author,
            sid,
            body,
            dateCreated: message.dateCreated,
            attributes: '',
            type: '',
          };
          setConversationMessages(
            (prevState: (Message | ConversationMessage)[]) => {
              if (prevState instanceof Array) {
                return [...prevState, updatedMessage] as Message[];
              } else {
                return [updatedMessage] as unknown as Message[];
              }
            }
          );
          fetchedConversation.setAllMessagesRead();
        });

        fetchedConversation.on('typingStarted', () => {
          setTypingIndicator(true);
        });

        fetchedConversation.on('typingEnded', () => {
          setTypingIndicator(false);
        });

        //3. Load messages
        const paginator = await fetchedConversation.getMessages(1000);
        const messages = await Promise.all(
          paginator.items.map(async s => {
            const mediaUrl =
              s.type === 'media' && s.media !== null
                ? await s.media.getContentTemporaryUrl()
                : '';
            const mediaType =
              s.type === 'media' && s.media !== null ? s.media.contentType : '';
            return {
              author: s.author,
              sid: s.sid,
              body: s.body,
              dateCreated: s.dateCreated,
              attributes: s.attributes,
              type: s.type,
              mediaUrl,
              mediaType,
            } as Message; // Add type assertion to Message
          })
        );
        if (!hookInvoked) return;

        setConversationMessages(messages);
      } catch (error) {
        console.error(
          'an error has happened when updating conversation messages',
          error
        );
      }
    };

    const init = async (uniqueName: string) => {
      try {
        setIsLoadingMessages(true);

        const fetchedConversation = await getInstantiatedConversation(
          uniqueName
        );

        conversationReference = fetchedConversation;

        if (fetchedConversation === undefined) {
          setIsLoadingMessages(false);
          return;
        }

        await getConversation(fetchedConversation);

        setIsLoadingMessages(false);
      } catch (error) {
        setIsLoadingMessages(false);
        console.error(error);
      }
    };
    init(uniqueName);

    return () => {
      hookInvoked = false;
      conversationReference?.removeAllListeners();
    };
  }, [uniqueName, selectedAgentIdentity]);

  return conversationMessages.length === 0
    ? {
        conversationMessages,
        instantiatedConversation,
        isEmpty: true,
        isLoadingMessages,
        typingIndicator,
      }
    : {
        conversationMessages,
        instantiatedConversation,
        isEmpty: false,
        isLoadingMessages,
        typingIndicator,
      };
};

export default useConversationsClient;
