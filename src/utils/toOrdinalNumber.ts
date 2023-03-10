import { Locale } from '@/context/UserConfigContext';

export const toOrdinalNumber = (dateString: string, locale: Locale): string => {
  const date = new Date(dateString);
  if (locale === 'en-US') {
    const day = String(date.getDate());
    if (day.endsWith('1') && !day.endsWith('11')) return `${day}st`;
    if (day.endsWith('2') && !day.endsWith('12')) return `${day}nd`;
    if (day.endsWith('3') && !day.endsWith('13')) return `${day}rd`;
    return `${day}th`;
  }
  return String(date.getDate());
};
