export const flattenLevel = (level: number) => {
  if (level === 0) return 0;
  return (Math.floor((level - 1) / 10) + 1) * 10;
};
