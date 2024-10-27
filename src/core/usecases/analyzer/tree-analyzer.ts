import type { RelationNode } from "../../types";
import { isExternalPath } from "../../utils/fs";

export type ChildrenTree<T extends RelationNode> = {
  key: string;
  children: ChildrenTree<T>[];
};

export const getChildrenTree = <T extends RelationNode>(
  relationList: T[],
  targetKey: string,
): ChildrenTree<T> => {
  const relationListWithoutLib = relationList.filter(
    (relation) =>
      !isExternalPath(relation.child) && !isExternalPath(relation.parent),
  );

  const visitedKeyMap: Record<string, boolean> = {};

  const buildTree = (key: string): ChildrenTree<T> => {
    visitedKeyMap[key] = true;

    const targetRelationList = relationListWithoutLib
      .filter((relation) => relation.parent === key)
      .filter((relation) => !visitedKeyMap[relation.child]);

    if (targetRelationList.length === 0) {
      visitedKeyMap[key] = false;
      return { key, children: [] };
    }

    const children = targetRelationList.map((relation) =>
      buildTree(relation.child),
    );

    return { key, children };
  };

  return buildTree(targetKey);
};

export type ParentsTree<T extends RelationNode> = {
  key: string;
  parents: ParentsTree<T>[];
};

export const getParentsTree = <T extends RelationNode>(
  relationList: T[],
  targetKey: string,
): ParentsTree<T> => {
  const relationListWithoutLib = relationList.filter(
    (relation) =>
      !isExternalPath(relation.child) && !isExternalPath(relation.parent),
  );

  const visitedKeyMap: Record<string, boolean> = {};

  const buildTree = (key: string): ParentsTree<T> => {
    visitedKeyMap[key] = true;

    const targetRelationList = relationListWithoutLib
      .filter((relation) => relation.child === key)
      .filter((relation) => !visitedKeyMap[relation.parent]);

    if (targetRelationList.length === 0) {
      visitedKeyMap[key] = false;
      return { key, parents: [] };
    }

    const parents = targetRelationList.map((relation) =>
      buildTree(relation.parent),
    );

    return { key, parents };
  };

  return buildTree(targetKey);
};
