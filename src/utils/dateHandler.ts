export const dateFormatter = (date: Date) => {
  const newDate = new Date(date);
  const localDateString = newDate.toLocaleString();

  return localDateString;
};
