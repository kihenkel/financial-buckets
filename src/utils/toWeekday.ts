import { Locale } from '@/context/UserConfigContext';

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const toWeekday = (dateString: string, locale: Locale): string => {
  const date = new Date(dateString);
  if (locale === 'en-US') {
    return weekdays[date.getDay()];
  }
  return date.toDateString();
}
