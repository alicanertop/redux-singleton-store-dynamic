export const isDataValid = <T>(data: T): data is NonNullable<T> => {
  switch (typeof data) {
    case 'undefined':
      return false;
    case 'bigint':
      return true;
    case 'number':
      return Number.isNaN(Number(data));
    default:
      return Boolean(data);
  }
};

export const isFunction = <T>(posFunc: T): posFunc is NonNullable<T> =>
  typeof posFunc === 'function';

export const hasFunction = <T extends object, K extends keyof T>(
  obj: T,
  key: K
): obj is NonNullable<T> => isFunction(obj[key]);

export const hasValue = <T extends object, K extends keyof T>(
  obj: T,
  key: K
): obj is T & Record<K, (...args: unknown[]) => void> => {
  if (isDataValid(obj)) {
    return isDataValid(obj[key]);
  }

  return false;
};
