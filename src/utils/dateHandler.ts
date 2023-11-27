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
