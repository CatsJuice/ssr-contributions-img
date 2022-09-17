export function sortObj(obj: any, filter = (v: any) => true): any {
  if (Object.prototype.toString.call(obj) === '[object Array]')
    return (obj as Array<unknown>).sort().map((el) => sortObj(el, filter));
  else if (Object.prototype.toString.call(obj) === '[object Object]') {
    const keys = Object.keys(obj).sort();
    return keys.reduce((prev, curr) => {
      prev[curr] = sortObj(obj[curr], filter);
      return prev;
    }, {} as any);
  } else if (filter(obj)) return obj;
}

export const hashObject = (obj: unknown, filter?: (v: any) => boolean) =>
  JSON.stringify(sortObj(obj, filter));
