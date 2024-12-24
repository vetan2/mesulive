export const getKSTDate = (value: string | number | Date): Date => {
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60000; // 분 단위 오프셋을 밀리초로 변환
  const kstOffset = 9 * 60 * 60000; // KST는 UTC+9
  return new Date(date.getTime() + offset + kstOffset);
};
