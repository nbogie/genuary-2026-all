export function repeat(n: number, fn: (ix: number) => void) {
  for (let i = 0; i < n; i++) {
    fn(i);
  }
}
export function snapTo(val: number, inc: number) {
  return inc * round(val / inc);
}
export function zipWith<A, B, C>(a: A[], b: B[], joinFn: (a: A, b: B) => C): C[] {
  let output = [];
  for (let i = 0; i < min(a.length, b.length); i++) {
    output.push(joinFn(a[i], b[i]));
  }
  return output;
}
