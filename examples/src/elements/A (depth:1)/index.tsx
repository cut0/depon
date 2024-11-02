import { node as C } from "./C (depth:2)";
import { node as D } from "./D (depth:2)";

export const nodeA = {
  ...C,
  ...D,
  A: "A (depth:1)",
};
