import { Locale } from '@/context/UserConfigContext';

export const toOrdinalNumber = (number: string | number, locale: Locale): string => {
  const numberString = String(number);
  if (locale === 'en-US') {
    switch (numberString) {
      case '1': return `${numberString}st`;
      case '2': return `${numberString}nd`;
      case '3': return `${numberString}rd`;
      default: return `${numberString}th`;
    }
  }
  return numberString;
}
