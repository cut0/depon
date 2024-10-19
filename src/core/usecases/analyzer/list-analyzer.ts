import type { RelationNode } from "../../types";
import { isExternalPath } from "../../utils/fs";

type List = {
  key: string;
}[];

export const getChildrenList = <T extends RelationNode>(
  relationList: T[],
  targetKey: string,
): List => {
  const relationListWithoutLib = relationList.filter(
    (relation) =>
      !isExternalPath(relation.child) && !isExternalPath(relation.parent),
  );
  const visitedKeyMap: Record<string, boolean> = {};
  const childrenList: string[] = [];

  const insertNode = (key: string) => {
    visitedKeyMap[key] = true;
    childrenList.push(key);

    const children = relationListWithoutLib
      .filter((item) => item.parent === key)
      .filter((relation) => !visitedKeyMap[relation.child]);

    for (const node of children) {
      insertNode(node.child);
    }
  };

  insertNode(targetKey);

  return [...new Set(childrenList)]
    .filter((key) => key !== targetKey)
    .map((key) => ({ key }));
};

export const getParentsList = <T extends RelationNode>(
  relationList: T[],
  targetKey: string,
): List => {
  const relationListWithoutLib = relationList.filter(
    (relation) =>
      !isExternalPath(relation.child) && !isExternalPath(relation.parent),
  );
  const visitedKeyMap: Record<string, boolean> = {};
  const parentsList: string[] = [];

  const insertNode = (key: string) => {
    visitedKeyMap[key] = true;
    parentsList.push(key);

    const parents = relationListWithoutLib
      .filter((item) => item.child === key)
      .filter((relation) => !visitedKeyMap[relation.parent]);

    for (const node of parents) {
      insertNode(node.parent);
    }
  };

  insertNode(targetKey);

  return [...new Set(parentsList)]
    .filter((key) => key !== targetKey)
    .map((key) => ({ key }));
};
