import * as fs from "node:fs";
import * as path from "node:path";

import { minimatch } from "minimatch";

export const getFilePathList = (rootDirPath: string) => {
  const filePathList: string[] = [];

  const readDirectory = (dirPath: string) => {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        readDirectory(fullPath);
      } else {
        filePathList.push(fullPath);
      }
    }
  };

  readDirectory(path.resolve(rootDirPath));

  return filePathList;
};

export const isContainDir = (filePath: string, dirs: string[]) => {
  return path
    .dirname(filePath)
    .split(path.sep)
    .some((dir) => dirs.includes(dir));
};

export const isMatchPattern = (filePath: string, patterns: string[]) => {
  return patterns.some((pattern) => minimatch(filePath, pattern));
};

export const isMatchExtension = (filePath: string, extensions: string[]) => {
  return extensions.some((extension) => filePath.endsWith(extension));
};

export const isExternalPath = (filePath: string) => {
  const regex = /^@?[A-Za-z0-9-]+(\/[A-Za-z0-9-]+)?$/;
  return regex.test(filePath);
};

export const hasExtension = (filePath: string) => {
  return path.extname(filePath) !== "";
};

export const isSupportExtension = (filePath: string, extensions: string[]) => {
  return extensions.some((extension) => filePath.endsWith(extension));
};

export const findFileWithExtension = (
  filePath: string,
  extensions: string[],
) => {
  return extensions
    .map((ext) => {
      if (fs.existsSync(`${filePath}.${ext}`)) {
        return `${filePath}.${ext}`;
      }
      if (fs.existsSync(`${filePath}/index.${ext}`)) {
        return `${filePath}/index.${ext}`;
      }
      return null;
    })
    .filter((file) => file != null) as string[];
};

export const replaceAliasMap = (
  filePath: string,
  aliasResolver: Record<string, string>,
) => {
  return Object.entries(aliasResolver).reduce((acc, [alias, realPath]) => {
    return acc.replace(alias, realPath);
  }, filePath);
};
