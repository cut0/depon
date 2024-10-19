import type { Command } from "commander";
import { createListCommand } from "./list-command";
import { createTreeCommand } from "./tree-command";

export const createCommand = (program: Command) => {
  createTreeCommand(program);
  createListCommand(program);
};
