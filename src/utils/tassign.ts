export function tassign<T extends U, U>(target: T, ...source: U[]): T {
  return Object.assign({}, target, ...source);
}
