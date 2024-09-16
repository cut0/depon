export type ImportType = "import" | "require" | "dynamicImport" | "export";

export type RelationNode = {
  parent: string;
  child: string;
};

export type FileRelationNode = RelationNode & {
  context: {
    importType: ImportType;
    targetType: "file" | "external";
  };
};
