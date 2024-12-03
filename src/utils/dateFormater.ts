/**
 * Returns the date in YYYY-MM-DD format.
 * @param date Date object
 * @returns Date string in YYYY-MM-DD format
 */
const dateFormater = (date: Date) => {
  return date.toISOString().split("T")[0];
};

export default dateFormater;
