import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface UnreadChatMessages {
  unreadMessages: number;
  conversations: UnreadMessagesPayload[];
}

const initialState: UnreadChatMessages = {
  unreadMessages: 0,
  conversations: [],
};

export interface UnreadMessagesPayload {
  unreadMessagesNumber: number | null;
  conversationUniqueName: string | null;
}

export const customInternalChatSlice = createSlice({
  name: 'customInternalChat',
  initialState,
  reducers: {
    updateCounter: (state, action: PayloadAction<UnreadMessagesPayload>) => {
      const doesConversationStateExist = state.conversations.some(
        conversation =>
          conversation.conversationUniqueName ===
          action.payload.conversationUniqueName
      );

      if (!doesConversationStateExist) {
        state.conversations.push(action.payload);
      }

      state.conversations.forEach(conversation => {
        if (
          conversation.conversationUniqueName ===
          action.payload.conversationUniqueName
        ) {
          if (
            conversation.unreadMessagesNumber ===
            action.payload.unreadMessagesNumber
          ) {
            return;
          }

          if (action.payload.unreadMessagesNumber === 0) {
            conversation.unreadMessagesNumber = 0;
          }

          conversation.unreadMessagesNumber =
            action.payload.unreadMessagesNumber;
          if (conversation.unreadMessagesNumber) {
            state.unreadMessages = conversation.unreadMessagesNumber;
          }
        }
      });

      let counter = 0;

      state.conversations.forEach(conversation => {
        if (conversation.unreadMessagesNumber) {
          counter += conversation.unreadMessagesNumber;
        }
      });

      state.unreadMessages = counter;
    },
  },
});

export const { updateCounter } = customInternalChatSlice.actions;
export default customInternalChatSlice.reducer;
