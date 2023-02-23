import { Currency, Locale } from '@/context/UserConfigContext';

export const toCurrency = (amount: number | string | undefined, locale: Locale, currency: Currency): string => {
  const value = typeof amount === 'string' ? Number.parseFloat(amount) : amount;
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    currencySign: 'accounting',
  });
  return formatter.format(value ?? 0);
};
