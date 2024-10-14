export const getRandomElements =
  (count: number) =>
  <T>(array: T[]): T[] => {
    const result = [...array];
    for (let i = 0; i < array.length - count; i++) {
      const randomIndex = Math.floor(Math.random() * result.length);
      result.splice(randomIndex, 1);
    }
    return result;
  };
