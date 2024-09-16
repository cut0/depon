import fs from "node:fs";
import path from "node:path";
import {
  genFileRelation,
  getChildrenTree,
  getParentsTree,
} from "@depon/core/src";
import type { Command } from "commander";
import { printChildrenTree, printParentsTree } from "../utils/printer";
import { toRecord, toSeparatedArray } from "../utils/string";

type Options = {
  children: boolean;
  parents: boolean;
  absolute: boolean;
  targetDir: string;
  ignorePatterns?: string[];
  aliasResolver?: Record<string, string> | Error;
};

export const createTreeCommand = (program: Command) => {
  program
    .command("tree <targetFile>")
    .description("Show Dependency Tree of the target file")
    .option("--no-children", "Include children", true)
    .option("--no-parents", "Include parents", true)
    .option("--absolute", "Show absolute path", false)
    .requiredOption("--target-dir <target-dir>", "Target directory")
    .option(
      "--ignore-patterns <pattern>",
      "Pattern to ignore (comma separated)",
      toSeparatedArray,
    )
    .option(
      "--alias-resolver <json>",
      "Alias resolver in JSON format",
      toRecord,
    )
    .action((target: string, options: Options) => {
      const file = path.resolve(target);

      if (!fs.existsSync(file)) {
        console.error("Target File does not exist.");
        process.exit(1);
      }

      if (options.aliasResolver instanceof Error) {
        console.error(options.aliasResolver.message);
        process.exit(1);
      }

      const relationList = genFileRelation({
        targetDir: options.targetDir,
        ignorePatterns: options.ignorePatterns,
        aliasResolver: options.aliasResolver,
      });

      if (options.children) {
        console.log("\n👶 Children Tree 👶");
        const tree = getChildrenTree(relationList, file);
        printChildrenTree(tree, options.absolute);
      }

      if (options.parents) {
        console.log("\n🎅 Parents Tree 🎅");
        const tree = getParentsTree(relationList, file);
        printParentsTree(tree, options.absolute);
      }
    });
};
