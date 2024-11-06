import { getFileRelationList } from "../services/file-relation";
import { getFilePathList, isContainDir, isMatchPattern } from "../utils/fs";

import type { FileRelationNode } from "../types";

export type Payload = {
  targetDir: string;
  ignorePatterns?: string[];
  aliasResolver?: Record<string, string>;
  ignoreTypeRelation?: boolean;
};

export const genFileRelation = (payload: Payload): FileRelationNode[] => {
  const {
    targetDir,
    aliasResolver,
    ignorePatterns = [],
    ignoreTypeRelation,
  } = payload;

  const files = getFilePathList(targetDir)
    .filter((filePath) => !isContainDir(filePath, ["node_modules"]))
    .filter((filePath) => !isMatchPattern(filePath, [...ignorePatterns]));

  const relationList: FileRelationNode[] = [];

  for (const filePath of files) {
    const relationListPerFile = getFileRelationList({
      baseFilePath: filePath,
      aliasResolver: aliasResolver ?? {},
      ignoreTypeRelation,
    });

    relationList.push(...relationListPerFile);
  }

  return relationList;
};
