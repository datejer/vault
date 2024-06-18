import { format, fromZonedTime } from "date-fns-tz";

export const dbDateToLocal = (dbTime: string) => {
  const date = fromZonedTime(dbTime, "GMT");
  const formatted = format(date, "yyyy-MM-dd HH:mm:ss zzz", {
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

  return formatted;
};
