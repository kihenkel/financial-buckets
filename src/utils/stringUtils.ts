export const N_A = 'N/A';

export const withFallback = (value: string | number | undefined | null, fallback: string = N_A): string => {
  if (value === undefined || value === null || value === '') return fallback;
  if (typeof value === 'number') return value.toString();
  return value;
};

export const parsePercentage = (text: string): number => {
  const sanitizedText = text.replace(/\%/g, '');
  const rate = Number.parseFloat(sanitizedText);
  return Number.parseFloat((rate / 100).toFixed(4));
};
