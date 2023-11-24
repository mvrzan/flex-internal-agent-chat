interface Worker {
  activityName: string;
  contactUri: string;
  email: string;
  firstName: string;
  fullName: string;
  lastName: string;
  imageUrl: string;
  workerSid: string;
}

export const formatSelectedAgentUtil = (selectedAgent: Worker) => {
  const formattedAgentData = {
    fullName: selectedAgent.fullName,
    firstName: selectedAgent.firstName,
    lastName: selectedAgent.lastName,
    imageUrl: selectedAgent.imageUrl,
    activityName: selectedAgent.activityName,
    email: selectedAgent.email,
    workerSid: selectedAgent.workerSid,
    contactUri: selectedAgent.contactUri,
  };

  return formattedAgentData;
};
