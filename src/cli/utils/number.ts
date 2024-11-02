export const isIntegerStr = (str?: string): boolean => {
  return !Number.isNaN(str) && Number.isInteger(Number(str));
};

export const parseSafeInt = (str: string | undefined): number | undefined => {
  if (str == null || !isIntegerStr(str)) {
    return undefined;
  }
  return Number.parseInt(str);
};
