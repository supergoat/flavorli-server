/**
 * Returns the time in the format HH:mm
 * @param { string } date - the date
 */
export const formatTime = (date: Date) => {
  let hours: string | number = date.getHours();
  let minutes: string | number = date.getMinutes();

  if (hours < 10) hours = '0' + hours;
  if (minutes < 10) minutes = '0' + minutes;

  return `${hours}:${minutes}`;
};

export const isOpenTime = (opensAt: String, closesAt: String) => {
  let startTime = opensAt;
  let endTime = closesAt;
  let currentDate = new Date();

  let startDate = new Date(currentDate.getTime());
  startDate.setHours(Number(startTime.split(':')[0]));
  startDate.setMinutes(Number(startTime.split(':')[1]));

  let endDate = new Date(currentDate.getTime());
  endDate.setHours(Number(endTime.split(':')[0]));
  endDate.setMinutes(Number(endTime.split(':')[1]));

  const isValid = startDate < currentDate && endDate > currentDate;

  return isValid;
};
