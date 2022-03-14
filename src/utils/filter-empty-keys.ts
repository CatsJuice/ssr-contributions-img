export const filterEmptyKeys = (obj: Record<string, any>) =>
  Object.keys(obj).reduce((res, key) => {
    if (obj[key] !== undefined && obj[key] !== null) res[key] = obj[key];
    return res;
  }, {});
