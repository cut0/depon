import type { RelationNode } from "../../types";
import { isExternalPath } from "../../utils/fs";

export type ChildrenTree<T extends RelationNode> = {
  key: string;
  children: ChildrenTree<T>[];
};

export const getChildrenTree = <T extends RelationNode>(
  relationList: T[],
  targetKey: string,
  options?: {
    limitedDepth?: number;
    stopCondition?: (key: string, depth: number) => boolean;
  },
): ChildrenTree<T> => {
  const relationListWithoutLib = relationList.filter(
    (relation) =>
      !isExternalPath(relation.child) && !isExternalPath(relation.parent),
  );

  const visitedKeyMap: Record<string, boolean> = {};

  const buildTree = (key: string, depth: number): ChildrenTree<T> => {
    visitedKeyMap[key] = true;

    if (options?.limitedDepth != null && depth >= options?.limitedDepth) {
      visitedKeyMap[key] = false;
      return { key, children: [] };
    }

    if (options?.stopCondition?.(key, depth)) {
      visitedKeyMap[key] = false;
      return { key, children: [] };
    }

    const targetRelationList = relationListWithoutLib
      .filter((relation) => relation.parent === key)
      .filter((relation) => !visitedKeyMap[relation.child]);

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
  options?: {
    limitedDepth?: number;
    stopCondition?: (key: string, depth: number) => boolean;
  },
): ParentsTree<T> => {
  const relationListWithoutLib = relationList.filter(
    (relation) =>
      !isExternalPath(relation.child) && !isExternalPath(relation.parent),
  );

  const visitedKeyMap: Record<string, boolean> = {};

  const buildTree = (key: string, depth: number): ParentsTree<T> => {
    visitedKeyMap[key] = true;

    if (options?.limitedDepth != null && depth >= options?.limitedDepth) {
      visitedKeyMap[key] = false;
      return { key, parents: [] };
    }

    if (options?.stopCondition?.(key, depth)) {
      visitedKeyMap[key] = false;
      return { key, parents: [] };
    }

    const targetRelationList = relationListWithoutLib
      .filter((relation) => relation.child === key)
      .filter((relation) => !visitedKeyMap[relation.parent]);

    const parents = targetRelationList.map((relation) =>
      buildTree(relation.parent, depth + 1),
    );

    visitedKeyMap[key] = false;
    return { key, parents };
  };

  return buildTree(targetKey, 0);
};
