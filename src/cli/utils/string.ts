export const toSeparatedArray = (value?: string): string[] | undefined => {
  if (value == null) {
    return undefined;
  }

  return value.split(",");
};

export const toRecord = (
  value?: string,
): Record<string, string> | Error | undefined => {
  if (value == null) {
    return undefined;
  }
  try {
    const record = JSON.parse(value);
    return record;
  } catch (error) {
    return Error("Invalid JSON for alias-resolver.");
  }
};
