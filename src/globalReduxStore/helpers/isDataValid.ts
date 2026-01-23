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
