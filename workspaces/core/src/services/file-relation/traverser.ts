import { Project, SyntaxKind } from "ts-morph";

import type { FileRelationNode } from "../../types";
import { replaceAliasMap } from "../../utils/fs";
import { createFileRelationNode } from "./helper";

const project = new Project();

type Payload = {
  baseFilePath: string;
  aliasResolver: Record<string, string>;
};

export const getFileRelationList = ({
  baseFilePath,
  aliasResolver,
}: Payload): FileRelationNode[] => {
  const sourceFile = project.addSourceFileAtPath(baseFilePath);
  const relationList: FileRelationNode[] = [];

  {
    /**
     * NOTE: Find children by import statements.
     * - import * as module from "path/to/module"
     */
    const childrenPathList = sourceFile
      .getImportDeclarations()
      .map((importDeclaration) => {
        return importDeclaration.getModuleSpecifierValue();
      });

    for (const childPath of childrenPathList) {
      const path = replaceAliasMap(childPath, aliasResolver);
      const node = createFileRelationNode(baseFilePath, path, "import");
      if (node != null) {
        relationList.push(node);
      }
    }
  }

  {
    /**
     * Note: Find children by export exportDeclaration
     * - export * from "path/to/module"
     */
    const childrenPathList = sourceFile
      .getExportDeclarations()
      .map((exportDeclaration) => exportDeclaration.getModuleSpecifierValue())
      .filter((childPath) => childPath != null);

    for (const childPath of childrenPathList) {
      const path = replaceAliasMap(childPath, aliasResolver);
      const node = createFileRelationNode(baseFilePath, path, "export");
      if (node != null) {
        relationList.push(node);
      }
    }
  }

  {
    /**
     * NOTE: Find children by dynamic import.
     * - import("path/to/module")
     */
    const childrenPathList = sourceFile
      .getDescendantsOfKind(SyntaxKind.CallExpression)
      .map((callExpr) => {
        const expression = callExpr.getExpression();
        if (expression.getKind() === SyntaxKind.ImportKeyword) {
          const [arg] = callExpr.getArguments();
          if (arg?.getKind() === SyntaxKind.StringLiteral) {
            const path = arg.getText().replace(/['"]/g, "");
            return path;
          }
        }
      })
      .filter((childPath) => childPath != null);

    for (const childPath of childrenPathList) {
      const path = replaceAliasMap(childPath, aliasResolver);
      const node = createFileRelationNode(baseFilePath, path, "dynamicImport");
      if (node != null) {
        relationList.push(node);
      }
    }
  }

  {
    /**
     * NOTE: Find children by require.
     * - require("path/to/module")
     */
    const childrenPathList = sourceFile
      .getDescendantsOfKind(SyntaxKind.CallExpression)
      .map((callExpr) => {
        const expression = callExpr.getExpression();
        if (
          expression.getKind() === SyntaxKind.Identifier &&
          expression.getText() === "require"
        ) {
          const [arg] = callExpr.getArguments();
          if (arg?.getKind() === SyntaxKind.StringLiteral) {
            const path = arg.getText().replace(/['"]/g, "");
            return path;
          }
        }
      })
      .filter((childPath) => childPath != null);

    for (const childPath of childrenPathList) {
      const path = replaceAliasMap(childPath, aliasResolver);
      const node = createFileRelationNode(baseFilePath, path, "require");
      if (node != null) {
        relationList.push(node);
      }
    }
  }

  return relationList;
};
