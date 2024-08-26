export const copyObject = <T>(obj: T): T => JSON.parse(JSON.stringify(obj)) as T;

export const toString = (o: object): string => JSON.stringify(o);
