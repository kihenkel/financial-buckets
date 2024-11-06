export const toPercentage = (rate: number | string, locale: string = 'en-US'): string => {
  if (rate === undefined) {
    return 'N/A';
  }
  const parsedRate = typeof rate === 'string' ? Number.parseFloat(rate) : rate;
  
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(parsedRate);
};

const YEAR_IN_MS = 1000 * 60 * 60 * 24 * 365;
export const calculateCDInterest = (
  initialDeposit: number,
  annualInterestRate: number,
  openDate: Date,
  maturityDate: Date,
  compoundingFrequency: number = 1 // default is annual compounding
): number => {
  if ([initialDeposit, annualInterestRate, openDate, maturityDate, compoundingFrequency].some((value) => value === undefined || value === null)) {
    return 0;
  }
  const totalYears = (maturityDate.getTime() - openDate.getTime()) / YEAR_IN_MS;
  const ratePerPeriod = annualInterestRate / compoundingFrequency;
  const totalPeriods = compoundingFrequency * totalYears;
  const totalAmount = initialDeposit * Math.pow((1 + ratePerPeriod / 100), totalPeriods);
  const totalInterest = totalAmount - initialDeposit;

  return totalInterest;
};