export const generateProgress = (id: number): number => {
  const seed = id * 9301 + 49297;
  const random = (seed % 233280) / 233280;
  return Math.floor(random * (98 - 5 + 1)) + 5;
};
