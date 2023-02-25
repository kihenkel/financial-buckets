import { IntervalModel, Intervals } from '@/models';

const intervalTypeHierachy = {
  [Intervals[0][0]]: 1,
  [Intervals[1][0]]: 2,
  [Intervals[2][0]]: 3,
  [Intervals[3][0]]: 4,
  [Intervals[4][0]]: 5,
};

export const sortIntervalItems = (itemA: IntervalModel, itemB: IntervalModel) => {
  if (itemA.intervalType !== itemB.intervalType) {
    return intervalTypeHierachy[itemA.intervalType] - intervalTypeHierachy[itemB.intervalType];
  }
  switch (itemA.intervalType) {
    case 'daily': return Date.parse(itemA.initialDate) - Date.parse(itemB.initialDate);
    case 'weekly': return new Date(itemA.initialDate).getDay() - new Date(itemB.initialDate).getDay();
    case 'semiMonthly': return Date.parse(itemA.initialDate) - Date.parse(itemB.initialDate);
    case 'monthly': return new Date(itemA.initialDate).getDate() - new Date(itemB.initialDate).getDate();
    case 'yearly': {
      const dateA = new Date(itemA.initialDate);
      const dateB = new Date(itemB.initialDate);
      return (dateA.getMonth() * 100 + dateA.getDate()) - (dateB.getMonth() * 100 + dateB.getDate());
    }
  }
};