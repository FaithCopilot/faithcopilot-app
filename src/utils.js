// https://stackoverflow.com/questions/643782/how-to-check-whether-an-object-is-a-date
export const getEndOfDayUTC = (date) => {
  if (
    !date ||
    !(date instanceof Date) ||
    !(typeof date.getMonth === 'function')
  ) {
    return date;
  };
  // UTC
  date.setUTCHours(23, 59, 59, 999);
  return date;
};

export const truncate = (str, len=15) => str?.length > len ? str.substr(0, len-1) + "..." : str;
