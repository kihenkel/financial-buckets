import { Space, Typography } from 'antd';
import { Interval, IntervalType } from '@/models';
import { toWeekday } from '@/utils/toWeekday';
import { useUserConfigContext } from '@/context';
import { toDayMonth } from '@/utils/toDayMonth';
import { toOrdinalNumber } from '@/utils/toOrdinalNumber';

const { Text } = Typography;

interface RecurringItemAvatarProps {
  intervalType: IntervalType;
  interval: number;
  date: string;
}

const avatarWidth = 80;
const getMainFontSize = (str: string) => {
  if (str.length <= 6) {
    return 24;
  }
  return 18;
};
const getSubtitleFontSize = (str: string) => {
  if (str.length <= 6) {
    return 16;
  } else if (str.length <= 11) {
    return 14;
  } else if (str.length <= 18) {
    return 12;
  }
  return 10;
};

export const RecurringItemAvatar = ({ intervalType, interval, date }: RecurringItemAvatarProps) => {
  const { locale } = useUserConfigContext();

  let main;
  let subtitle;
  if (intervalType === 'daily' && interval === 1) {
    main = <Text strong style={{ minWidth: avatarWidth, fontSize: 24 }}>{Interval.daily.label}</Text>;
  } else {
    let h2 = '';
    let h5 = '';
    if (intervalType === 'daily' && interval > 1) {
      h2 = 'Daily';
      h5 = interval === 1 ? Interval.weekly.label : `Every ${interval} ${Interval.daily.plural}`;
    } else if (intervalType === 'weekly') {
      h2 = toWeekday(date, locale);
      h5 = interval === 1 ? Interval.weekly.label : `Every ${interval} ${Interval.weekly.plural}`;
    } else if (intervalType === 'semiMonthly') {
      h2 = '1st & 15th';
      h5 = 'Semi-monthly';
    } else if (intervalType === 'monthly') {
      h2 = toOrdinalNumber(date, locale);
      h5 = interval === 1 ? Interval.monthly.label : `Every ${interval} ${Interval.monthly.plural}`;
    } else if (intervalType === 'yearly') {
      h2 = toDayMonth(date, locale);
      h5 = interval === 1 ? Interval.yearly.label : `Every ${interval} ${Interval.yearly.plural}`;
    }
    main = <Text strong style={{ minWidth: avatarWidth, fontSize: getMainFontSize(h2) }}>{h2}</Text>;
    subtitle = <Text type="secondary" style={{ minWidth: avatarWidth, fontSize: getSubtitleFontSize(h5) }}>{h5}</Text>;
  }

  return (
    <Space.Compact block direction="vertical">
      {main}
      {subtitle}
    </Space.Compact>
  );
};
