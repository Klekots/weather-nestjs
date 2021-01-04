import { format, formatISO } from 'date-fns';

const defaultDatePattern = 'dd-MM-yyyy HH:mm:ss';

const currentTimeISO = (): string => {
  return formatISO(Date.now() + 3600000);
};
const dayAgoISO = (): string => {
  return formatISO(Date.now() - 86400000);
};
const currentTimeString = (pattern: string = defaultDatePattern): string => {
  return format(Date.now(), pattern);
};
const dayAgoString = (pattern: string = defaultDatePattern): string => {
  return format(Date.now() - 86400000, pattern);
};
const formatDate = (
  date: any,
  pattern: string = defaultDatePattern,
): string => {
  return format(date, pattern);
};

export {
  defaultDatePattern,
  currentTimeISO,
  dayAgoISO,
  currentTimeString,
  dayAgoString,
  formatDate,
};
