export const toPercentage = (rate: number): string => {
  const percentage = rate * 100;
  return `${percentage.toFixed(2)}%`;
};

const YEAR_IN_MS = 1000 * 60 * 60 * 24 * 365;
export const calculateCDInterest = (
  initialDeposit: number,
  annualInterestRate: number,
  openDate: Date,
  maturityDate: Date,
  compoundingFrequency: number = 1 // default is annual compounding
): number => {
  const totalYears = (maturityDate.getTime() - openDate.getTime()) / YEAR_IN_MS;
  const ratePerPeriod = annualInterestRate / compoundingFrequency;
  const totalPeriods = compoundingFrequency * totalYears;
  const totalAmount = initialDeposit * Math.pow((1 + ratePerPeriod / 100), totalPeriods);
  const totalInterest = totalAmount - initialDeposit;

  return totalInterest;
};