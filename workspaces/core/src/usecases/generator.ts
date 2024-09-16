import { getFileRelationList } from "../services/file-relation";
import { getFilePathList, isMatchPattern } from "../utils/fs";

import type { FileRelationNode } from "../types";

export type Payload = {
  targetDir: string;
  ignorePatterns?: string[];
  aliasResolver?: Record<string, string>;
};

export const genFileRelation = (payload: Payload): FileRelationNode[] => {
  const { targetDir, aliasResolver, ignorePatterns = [] } = payload;

  const files = getFilePathList(targetDir).filter(
    (filePath) =>
      !isMatchPattern(filePath, ["**/node_modules/**/*", ...ignorePatterns]),
  );

  const relationList: FileRelationNode[] = [];

  for (const filePath of files) {
    const relationListPerFile = getFileRelationList({
      baseFilePath: filePath,
      aliasResolver: aliasResolver ?? {},
    });

    relationList.push(...relationListPerFile);
  }

  return relationList;
};
