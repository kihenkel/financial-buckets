import { Locale } from '@/context/UserConfigContext';

export const toDayMonth = (dateString: string, locale: Locale): string => {
  const date = new Date(dateString);
  if (locale === 'en-US') {
    return `${date.getMonth() + 1}/${date.getDate()}`;
  }
  return date.toDateString();
};
