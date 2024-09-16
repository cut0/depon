import * as path from "node:path";

import { SUPPORT_EXTENSIONS } from "../../constants";
import type { FileRelationNode, ImportType } from "../../types";
import {
  findFileWithExtension,
  hasExtension,
  isExternalPath,
} from "../../utils/fs";

export const createFileRelationNode = (
  baseFilePath: string,
  childRelativeFilePath: string,
  importType: ImportType,
): FileRelationNode | null => {
  if (isExternalPath(childRelativeFilePath)) {
    const relationNode = {
      parent: baseFilePath,
      child: childRelativeFilePath,
      context: {
        importType: importType,
        targetType: "external" as const,
      },
    };
    return relationNode;
  }

  if (hasExtension(childRelativeFilePath)) {
    const relationNode = {
      parent: baseFilePath,
      child: path.join(path.dirname(baseFilePath), childRelativeFilePath),
      context: {
        importType: importType,
        targetType: "file" as const,
      },
    };
    return relationNode;
  }

  for (const childPath of findFileWithExtension(
    path.join(path.dirname(baseFilePath), childRelativeFilePath),
    SUPPORT_EXTENSIONS,
  )) {
    const relationNode = {
      parent: baseFilePath,
      child: childPath,
      context: {
        importType: importType,
        targetType: "file" as const,
      },
    };
    return relationNode;
  }
  return null;
};
