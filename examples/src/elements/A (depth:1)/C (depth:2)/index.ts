import { node as F } from "./F (depth:3)";
import { node as G } from "./G (depth:3)";

export const node = {
  ...F,
  ...G,
  C: "C (depth:2)",
};
