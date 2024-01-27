import { Conversation } from '@twilio/conversations';

export interface Message {
  attributes: object;
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

export interface Worker {
  activity_name: string;
  attributes: {
    contact_uri: string;
    full_name: string;
    email: string;
    image_url: string;
  };
  date_activity_changed?: string;
  date_updated: string;
  friendly_name: string;
  worker_activity_sid: string;
  worker_sid: string;
  workspace_sid: string;
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
  participant: string | null | undefined;
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
  participant: string | null | undefined;
  fetchedConversation: Conversation;
  unreadMessagesNumber: number;
}
