// All dates are stored as GMT in the database
export const dbTimeToLocal = (dbTime: string) => {
  const date = new Date(dbTime + " GMT");

  const timezone = new Intl.DateTimeFormat(undefined, {
    timeZoneName: "short",
  })
    .format(date)
    .split(" ")[1];

  return date.toLocaleString() + " " + timezone;
};
