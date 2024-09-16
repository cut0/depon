import path from "node:path";

export const formatRelativePath = (to: string) => {
  return path.relative(process.cwd(), to);
};
