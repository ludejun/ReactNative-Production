import dayjs, { Dayjs } from 'dayjs';

export const formatDate = (date: Date | Dayjs | string, format = 'YYYY-MM-DD'): string | null =>
  date ? dayjs(date).format(format) : '--';
export const formatProductDate = (
  date: Date | Dayjs | string,
  format = 'YYYY-MM-DD H:mm',
): string | null => (date ? dayjs(date).format(format) : '--');
export const formatTime = (time: string) => time && time.replace(/\s/g, '');
export const inSevenDays = (time: string) => {
  const afterSevenDate = dayjs(new Date()).add(7, 'days'); // moment
  return dayjs(time).isBefore(afterSevenDate) && dayjs(time).isAfter(new Date());
};

export const getDate = (format = 'YYYY-MM-DD-H:m:s.SSS') => dayjs().format(format);
