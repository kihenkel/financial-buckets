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
  return Date.parse(itemA.date) - Date.parse(itemB.date);
};