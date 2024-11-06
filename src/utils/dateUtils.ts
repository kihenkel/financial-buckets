export const toLocalDate = (inputDate: string | Date): string => {
  if (!inputDate) {
    return 'N/A';
  }
  const date = typeof inputDate === 'string' ? new Date(inputDate) : inputDate;
  return date.toLocaleDateString();
};
