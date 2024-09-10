import { floor, now, round } from 'lodash';

export const calculateElapsedTime = (startDate: Date, endDate?: Date) => {
  const startTime = startDate.getTime();

  // Get the current timestamp
  let endTime = now();

  if (endDate && endDate?.getTime() > 0) {
    endTime = endDate.getTime();
  }
  // Calculate the elapsed time in milliseconds
  const elapsedTime = endTime - startTime;

  // Convert the elapsed time to minutes, seconds, and hours
  const hours = floor(elapsedTime / 3600000); // 1 hour = 60 minutes * 60 seconds * 1000 milliseconds
  const remainingTime = elapsedTime % 3600000; // Remaining time after subtracting hours
  const minutes = floor(remainingTime / 60000); // 1 minute = 60 seconds * 1000 milliseconds
  const seconds = round((remainingTime % 60000) / 1000, 3);

  // Create the time format string
  let timeString = '';

  if (hours > 0) {
    timeString += `${hours} hour `;
  }

  if (minutes > 0) {
    timeString += `${minutes} min `;
  }

  timeString += `${seconds} sec`;

  // Print the elapsed time
  return timeString;
};
