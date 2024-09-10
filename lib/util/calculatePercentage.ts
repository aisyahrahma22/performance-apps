export const calculatePercentage = (value: number, total: number) => {
  if (!total) return `0 %`;
  return `${parseFloat(Math.abs((value / total) * 100).toFixed(1))} %`;
};
