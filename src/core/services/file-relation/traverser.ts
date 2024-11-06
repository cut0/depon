import { Project, SyntaxKind } from "ts-morph";

import type { FileRelationNode } from "../../types";
import { replaceAliasMap } from "../../utils/fs";
import { createFileRelationNode } from "./helper";

const project = new Project();

type Payload = {
  baseFilePath: string;
  aliasResolver: Record<string, string>;
  ignoreTypeRelation?: boolean;
};

export const getFileRelationList = ({
  baseFilePath,
  aliasResolver,
  ignoreTypeRelation = false,
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
      /**
       * NOTE: Filter out type-only imports.
       * - import type { Type } from "path/to/module"
       * - import { type Type } from "path/to/module"
       * - import type * as module from "path/to/module"
       */
      .filter((declaration) => {
        if (!ignoreTypeRelation) {
          return true;
        }
        if (declaration.isTypeOnly()) {
          return false;
        }
        if (declaration.getDefaultImport() != null) {
          return true;
        }
        if (declaration.getNamespaceImport() != null) {
          return true;
        }
        if (declaration.getNamedImports().length !== 0) {
          if (declaration.getNamedImports().some((el) => !el.isTypeOnly())) {
            return true;
          }
          return false;
        }
        return true;
      })
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
      /**
       * NOTE: Filter out type-only exports.
       * - export type { Type } from "path/to/module"
       * - export { type Type } from "path/to/module"
       * - export type * as module from "path/to/module"
       */
      .filter((declaration) => {
        if (!ignoreTypeRelation) {
          return true;
        }
        if (declaration.isTypeOnly()) {
          return false;
        }
        if (declaration.getNamespaceExport() != null) {
          return true;
        }
        if (declaration.getNamedExports().length !== 0) {
          if (declaration.getNamedExports().some((el) => !el.isTypeOnly())) {
            return true;
          }
          return false;
        }
        return true;
      })
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
