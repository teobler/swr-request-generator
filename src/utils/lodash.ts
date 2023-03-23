export const get = (obj?: Record<string, any>, path?: string | string[], defValue?: any) => {
  if (!obj || !path) {
    return defValue;
  }

  const pathArray = Array.isArray(path) ? path : path?.match(/([^[.\]])+/g);
  const result = pathArray?.reduce((prevObj, key) => prevObj && prevObj[key], obj);

  return result === undefined ? defValue : result;
};

export const has = (obj?: Record<string, any>, path?: string) => {
  if (!obj || !path) {
    return false;
  }

  const pathArray = path?.match(/([^[.\]])+/g);

  return !!pathArray?.reduce((prevObj, key) => prevObj && prevObj[key], obj);
};

export const sortBy = (key: string) => {
  return (a: Record<string, any>, b: Record<string, any>) => (a[key] > b[key] ? 1 : b[key] > a[key] ? -1 : 0);
};

export const pick = (object: Record<string, any>, keys: string[]) => {
  return keys.reduce((res: Record<string, any>, key) => {
    if (object.hasOwnProperty(key)) {
      res[key] = object[key];
    }
    return res;
  }, {});
};

export const pickBy = (object: Record<string, any>, callback: (value: any) => boolean) => {
  for (const key in object) {
    if (callback(object[key])) {
      return object[key];
    }
  }

  return undefined;
};

export const trimEnd = (str: string, c = "\\s") => str.replace(new RegExp(`^(.*?)([${c}]*)$`), "$1");
