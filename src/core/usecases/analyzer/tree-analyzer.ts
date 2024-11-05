import type { RelationNode } from "../../types";
import { isExternalPath } from "../../utils/fs";

export type ChildrenTree<T extends RelationNode> = {
  key: string;
  children: ChildrenTree<T>[];
};

export const getChildrenTree = <T extends RelationNode>(
  relationList: T[],
  targetKey: string,
  limitedDepth?: number,
): ChildrenTree<T> => {
  const relationListWithoutLib = relationList.filter(
    (relation) =>
      !isExternalPath(relation.child) && !isExternalPath(relation.parent),
  );

  const visitedKeyMap: Record<string, boolean> = {};

  const buildTree = (key: string, depth: number): ChildrenTree<T> => {
    visitedKeyMap[key] = true;

    if (limitedDepth != null && depth >= limitedDepth) {
      visitedKeyMap[key] = false;
      return { key, children: [] };
    }

    const targetRelationList = relationListWithoutLib
      .filter((relation) => relation.parent === key)
      .filter((relation) => !visitedKeyMap[relation.child]);

    if (targetRelationList.length === 0) {
      visitedKeyMap[key] = false;
      return { key, children: [] };
    }

    const children = targetRelationList.map((relation) =>
      buildTree(relation.child, depth + 1),
    );

    visitedKeyMap[key] = false;
    return { key, children };
  };

  return buildTree(targetKey, 0);
};

export type ParentsTree<T extends RelationNode> = {
  key: string;
  parents: ParentsTree<T>[];
};

export const getParentsTree = <T extends RelationNode>(
  relationList: T[],
  targetKey: string,
  limitedDepth?: number,
): ParentsTree<T> => {
  const relationListWithoutLib = relationList.filter(
    (relation) =>
      !isExternalPath(relation.child) && !isExternalPath(relation.parent),
  );

  const visitedKeyMap: Record<string, boolean> = {};

  const buildTree = (key: string, depth: number): ParentsTree<T> => {
    visitedKeyMap[key] = true;

    if (limitedDepth != null && depth >= limitedDepth) {
      visitedKeyMap[key] = false;
      return { key, parents: [] };
    }

    const targetRelationList = relationListWithoutLib
      .filter((relation) => relation.child === key)
      .filter((relation) => !visitedKeyMap[relation.parent]);

    if (targetRelationList.length === 0) {
      visitedKeyMap[key] = false;
      return { key, parents: [] };
    }

    const parents = targetRelationList.map((relation) =>
      buildTree(relation.parent, depth + 1),
    );

    visitedKeyMap[key] = false;
    return { key, parents };
  };

  return buildTree(targetKey, 0);
};
