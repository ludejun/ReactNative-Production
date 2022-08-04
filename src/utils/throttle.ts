/**
 * @param fn {function} 被截流函数
 * @param delay {number} 延迟时间/ms
 * @param immediate {boolean} 是否先执行一次，默认先执行一次
 */
export default function throttle(fn: (arg0: unknown) => void, delay = 500, immediate = true) {
  let last = 0;
  return (...rest: unknown[]) => {
    const current = new Date().getTime();
    if (immediate) last = current;
    if (current - last > delay || current <= last) {
      fn(rest);
      last = current;
    }
  };
}
