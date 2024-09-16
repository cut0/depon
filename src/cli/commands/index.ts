import type { Command } from "commander";
import { createListCommand } from "./list";
import { createTreeCommand } from "./tree";

export const createCommand = (program: Command) => {
  createTreeCommand(program);
  createListCommand(program);
};
