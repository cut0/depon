import type { RelationNode } from "../types";

type ChildrenTree<T extends RelationNode> = {
  key: string;
  children: ChildrenTree<T>[];
};

export const getChildrenTree = <T extends RelationNode>(
  list: T[],
  key: string,
): ChildrenTree<T> => {
  const buildSubTree = (key: string): ChildrenTree<T> => {
    const children = list
      .filter((relation) => relation.parent === key)
      .map((relation) => buildSubTree(relation.child));
    return { key, children };
  };

  const tree = {
    key,
    children: list
      .filter((item) => item.parent === key)
      .map((item) => buildSubTree(item.child)),
  };

  return tree;
};

type ParentsTree<T extends RelationNode> = {
  key: string;
  parents: ParentsTree<T>[];
};

export const getParentsTree = <T extends RelationNode>(
  list: T[],
  key: string,
): ParentsTree<T> => {
  const buildSubTree = (key: string): ParentsTree<T> => {
    const parents = list
      .filter((relation) => relation.parent === key)
      .map((relation) => buildSubTree(relation.parent));
    return { key, parents };
  };

  const tree = {
    key,
    parents: list
      .filter((item) => item.child === key)
      .map((item) => buildSubTree(item.parent)),
  };

  return tree;
};

type List = {
  key: string;
}[];

export const getChildrenList = <T extends RelationNode>(
  list: T[],
  key: string,
): List => {
  const res: string[] = [];

  const insertNode = (key: string) => {
    res.push(key);
    const children = list.filter((item) => item.parent === key);
    for (const node of children) {
      insertNode(node.child);
    }
  };

  const roots = list.filter((item) => item.parent === key);

  for (const root of roots) {
    insertNode(root.child);
  }

  return [...new Set(res)].map((key) => ({ key }));
};

export const getParentsList = <T extends RelationNode>(
  list: T[],
  key: string,
): List => {
  const res: string[] = [];

  const insertNode = (key: string) => {
    res.push(key);
    const parents = list.filter((item) => item.parent === key);
    for (const node of parents) {
      insertNode(node.parent);
    }
  };

  const roots = list.filter((item) => item.child === key);

  for (const root of roots) {
    insertNode(root.parent);
  }

  return [...new Set(res)].map((key) => ({ key }));
};
