export const isFunction = (obj: unknown): obj is (...args: unknown[]) => void =>
  typeof obj === 'function';
