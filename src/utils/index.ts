/**
 * 格式化秒
 * @param result
 * @returns {string}
 */
export function formatSecond(result: number) {
  const h = Math.floor((result / 3600) % 24);
  const m = Math.floor((result / 60) % 60);
  const s = Math.floor(result % 60);
  let str = s + '秒';
  if (m > 0) {
    str = m + '分钟' + str;
  }
  if (h > 0) {
    str = h + '小时' + str;
  }

  return str;
}
