import { combineReducers } from '@reduxjs/toolkit';
import { AppState as FlexAppState } from '@twilio/flex-ui';
import customInternalChatReducer, {
  UnreadChatMessages,
  updateCounter,
} from './CustomInternalChatState';

export const namespace = 'internalChatState';

export const actions = {
  customInternalChat: {
    updateCounter,
  },
};

export interface AppState {
  flex: FlexAppState;
  pluginState: {
    customInternalChat: UnreadChatMessages;
  };
}

export const reducers = combineReducers({
  customInternalChat: customInternalChatReducer,
});
