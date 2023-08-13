export interface LiveQueryAddedEvent<T> {
  key: string;
  value: T;
}

export interface LiveQueryUpdatedEvent<T> {
  key: string;
  value: T;
}

export interface LiveQueryRemovedEvent {
  key: string;
}

export interface Message {
  attributes: Object;
  author: string;
  body: string;
  dateCreated: Date;
  sid: string;
  type: string;
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
