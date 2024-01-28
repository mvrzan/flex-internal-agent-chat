// Type: Utility
// Description: Contains a function that formats the passed in date to a readable format

export const dateFormatter = (date: Date) => {
  const newDate = new Date(date);
  const localDateString = newDate.toLocaleString();

  return localDateString;
};

export const dateStringFormatter = (date: Date) => {
  const newDate = new Date(date);
  const localDateString = newDate.toLocaleDateString();

  return localDateString;
};
