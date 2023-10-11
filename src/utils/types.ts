import { Conversation } from '@twilio/conversations';

export interface Message {
  attributes: Object;
  author: string;
  body: string;
  dateCreated: Date;
  sid: string;
  type: string;
  mediaUrl: string;
  mediaType: string;
}

export interface SelectedAgent {
  activityName: string;
  contactUri: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  imageUrl: string;
}

export interface WorkerData {
  firstName: string;
  lastName: string;
  contactUri: string;
  fullName: string;
  imageUrl: string;
  value: string;
  workerSid: string;
  email: string;
  activityName: string;
}

export interface FilteredWorkerInfo {
  firstName: string;
  lastName: string;
  contactUri: string;
  fullName: string;
  imageUrl: string;
  value: string;
  workerSid: string;
  email: string;
  activityName: string;
  uniqueName: string | null;
  participant: string | null;
  fetchedConversation: Conversation;
}

export interface FilteredConversation {
  firstName: string;
  lastName: string;
  contactUri: string;
  fullName: string;
  imageUrl: string;
  value: string;
  workerSid: string;
  email: string;
  activityName: string;
  uniqueName: string | null;
  participant: string | null;
  fetchedConversation: Conversation;
  unreadMessagesNumber: number;
}
