import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface UnreadChatMessages {
  unreadMessages: number;
}

const initialState: UnreadChatMessages = {
  unreadMessages: 0,
};

export const customInternalChatSlice = createSlice({
  name: 'customInternalChat',
  initialState,
  reducers: {
    updateCounter: (state, action: PayloadAction<number | null>) => {
      if (typeof action.payload === 'number') {
        state.unreadMessages = action.payload;
      } else {
        state.unreadMessages;
      }
    },
  },
});

export const { updateCounter } = customInternalChatSlice.actions;
export default customInternalChatSlice.reducer;
