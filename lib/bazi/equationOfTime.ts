/** 返回均时差分钟数。
 * 公式采用 NOAA 常用近似：B = 2π(n-81)/364，
 * EoT = 9.87sin(2B) - 7.53cos(B) - 1.5sin(B)。
 */
export function getEquationOfTimeMinutes(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((date.getTime() - start.getTime()) / 86400000);
  const b = (2 * Math.PI * (dayOfYear - 81)) / 364;
  return 9.87 * Math.sin(2 * b) - 7.53 * Math.cos(b) - 1.5 * Math.sin(b);
}
