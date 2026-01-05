export function repeat(n: number, fn: (ix: number) => void) {
  for (let i = 0; i < n; i++) {
    fn(i);
  }
}
export function snapTo(val: number, inc: number) {
  return inc * round(val / inc);
}
