# DePon!!

"DePon!!" is a tool for visualizing the dependencies of JS/TS-based projects.
It provides both a CLI and functions.

In the future, it will also offer the feature to visualize dependencies as a graph.

## CLI

The CLI provides the following commands:

- [tree](#tree-command)
  - Displays file dependencies in a tree format.
- [list](#list-command)
  - Displays file dependencies in a list format.

Examples targeting [`./examples`](./examples) are shown below.

### Tree Command

Displays the dependencies of the target file in a tree format.

```shell
# input
npx depon tree --target-dir ./examples/src ./examples/src/main.tsx
```

```shell
# output
👶 Children Tree 👶
└── examples/src/main.tsx
    ├── examples/src/App.tsx
    │   ├── examples/src/assets/react.svg
    │   └── examples/src/App.css
    └── examples/src/index.css

🎅 Parents Tree 🎅
└── examples/src/main.tsx
```

| Option                      | Type    | Description                                                                                 | Default Value |
| --------------------------- | ------- | ------------------------------------------------------------------------------------------- | ------------- |
| target-dir\*                | string  | Specify the target directory                                                                | None          |
| --no-children               | boolean | Do not display child dependencies                                                           | false         |
| --no-parents                | boolean | Do not display parent dependencies                                                          | false         |
| --absolute                  | string  | Display as absolute paths                                                                   | false         |
| --ignore-patterns <pattern> | string  | Specify patterns of files/directories to exclude from analysis                              | None          |
| --alias-resolver <json>     | record  | If `{ "@" : ".", "~" : ".." }`, then it would be `~/@/path` will be replaced as `.././path` | None          |

### List Command

Displays the dependencies of the target file in a list format.

```shell
# input
npx depon list --target-dir ./examples/src ./examples/src/main.tsx
```

```shell
# output
👶 Children List 👶
examples/src/App.tsx
examples/src/assets/react.svg
examples/src/App.css
examples/src/index.css

🎅 Parents List 🎅
```

| Option                      | Type    | Description                                                                                 | Default Value |
| --------------------------- | ------- | ------------------------------------------------------------------------------------------- | ------------- |
| target-dir\*                | string  | Specify the target directory                                                                | None          |
| --no-children               | boolean | Do not display child dependencies                                                           | false         |
| --no-parents                | boolean | Do not display parent dependencies                                                          | false         |
| --absolute                  | string  | Display as absolute paths                                                                   | false         |
| --ignore-patterns <pattern> | string  | Specify patterns of files/directories to exclude from analysis                              | None          |
| --alias-resolver <json>     | record  | If `{ "@" : ".", "~" : ".." }`, then it would be `~/@/path` will be replaced as `.././path` | None          |

## API

The API provides the following functions under generator and analyzer.

- `generator`
  - Analyze dependencies from the target directory.
  - [`genFileRelation`](#genfilerelation)
- `analyzer`
  - Get dependencies from the analysis results.
  - [`getChildrenList`](#getchildrenlist-getparentslist)
  - [`getParentsList`](#getchildrenlist-getparentslist)
  - [`getChildrenTree`](#getchildrentree-getparentstree)
  - [`getParentsTree`](#getchildrentree-getparentstree)

Below is a concrete example.

```ts
import {
  genFileRelation,
  getChildrenList,
  getParentsList,
  getChildrenTree,
  getParentsTree,
} from "depon/core";

const targetDir = "./examples/src";

const fileRelation = genFileRelation({ targetDir });

// Get a list of files that depend on main.tsx
const childrenList = getChildrenList(fileRelation, "main.tsx");
const parentsList = getParentsList(fileRelation, "main.tsx");

// Get a tree of files that depend on main.tsx
const childrenTree = getChildrenTree(fileRelation, "main.tsx");
const parentsTree = getParentsTree(fileRelation, "main.tsx");
```

---

### `genFileRelation`

Arguments for `genFileRelation`

| Argument         | Type                                | Description                                                                                  |
| ---------------- | ----------------------------------- | -------------------------------------------------------------------------------------------- |
| `targetDir`      | `string`                            | Specify the target directory                                                                 |
| `ignorePatterns` | `string[] (optional)`               | Specify patterns of files/directories to exclude                                             |
| `aliasResocler`  | `Record<string, string> (optional)` | If `{ "@" : ".", "~" : ".." }`, then it would be `~/@/path` will be replaced as `.././path`. |

Return value of `genFileRelation`

```ts
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
```

| Type                 | Description                                         |
| -------------------- | --------------------------------------------------- |
| `FileRelationNode[]` | Contains paths of `parent` and `child` dependencies |

---

### `getChildrenList`, `getParentsList`

Arguments for `getChildrenList`, `getParentsList`

| Argument       | Type                 | Description                                   |
| -------------- | -------------------- | --------------------------------------------- |
| `relationList` | `FileRelationNode[]` | Specify the return value of `genFileRelation` |
| `targetKey`    | `string`             | Specify the target file                       |

Return value of `getChildrenList`, `getParentsList`

| Type               | Description                                         |
| ------------------ | --------------------------------------------------- |
| `{ key:string }[]` | Array containing paths of related files under `key` |

---

### `getChildrenTree`, `getParentsTree`

Arguments for `getChildrenTree`, `getParentsTree`

| Argument       | Type                 | Description                                   |
| -------------- | -------------------- | --------------------------------------------- |
| `relationList` | `FileRelationNode[]` | Specify the return value of `genFileRelation` |
| `targetKey`    | `string`             | Specify the target file                       |

Return value of `getChildrenTree`, `getParentsTree`

```ts
// Return value of getChildrenTree
type ChildrenTree<T extends RelationNode> = {
  key: string;
  children: ChildrenTree<T>[];
};

// Return value of getParentsTree
type ParentsTree<T extends RelationNode> = {
  key: string;
  parents: ParentsTree<T>[];
};
```

| Type                          | Description                                                   |
| ----------------------------- | ------------------------------------------------------------- |
| `ChildrenTree \| ParentsTree` | Have a recursive structure of related file paths in tree form |
