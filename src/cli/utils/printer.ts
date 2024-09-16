import { formatRelativePath } from "./fs";

type ChildrenNode = {
  key: string;
  children: ChildrenNode[];
};

export const printChildrenTree = (
  node: ChildrenNode,
  isAbsolute: boolean,
  prefix = "",
  isLast = true,
) => {
  const branch = isLast ? "└── " : "├── ";
  const path = isAbsolute ? node.key : formatRelativePath(node.key);
  console.log(`${prefix}${branch}${path}`);

  const newPrefix = prefix + (isLast ? "    " : "│   ");

  node.children.forEach((child, index) => {
    const isLastChild = index === node.children.length - 1;
    printChildrenTree(child, isAbsolute, newPrefix, isLastChild);
  });
};

type ParentsNode = {
  key: string;
  parents: ParentsNode[];
};

export const printParentsTree = (
  node: ParentsNode,
  isAbsolute: boolean,
  prefix = "",
  isLast = true,
) => {
  const branch = isLast ? "└── " : "├── ";
  const path = isAbsolute ? node.key : formatRelativePath(node.key);

  console.log(`${prefix}${branch}${path}`);

  const newPrefix = prefix + (isLast ? "    " : "│   ");

  node.parents.forEach((parent, index) => {
    const isLastParent = index === node.parents.length - 1;
    printParentsTree(parent, isAbsolute, newPrefix, isLastParent);
  });
};

export const printList = (list: string[], isAbsolute: boolean) => {
  for (const item of list) {
    const path = isAbsolute ? item : formatRelativePath(item);
    console.log(path);
  }
};
