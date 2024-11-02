import fs from "node:fs";
import path from "node:path";
import type { Command } from "commander";
import ora from "ora";
import { genFileRelation, getChildrenList, getParentsList } from "../../core";
import { isIntegerStr, parseSafeInt } from "../utils/number";
import { printList } from "../utils/printer";
import { toRecord, toSeparatedArray } from "../utils/string";

type Options = {
  children: boolean;
  parents: boolean;
  absolute: boolean;
  targetDir: string;
  depth?: string;
  ignorePatterns?: string[];
  aliasResolver?: Record<string, string> | Error;
};

export const createListCommand = (program: Command) => {
  program
    .command("list <targetFile>")
    .description("Show Dependency List of the target file")
    .option("--no-children", "Include children", true)
    .option("--no-parents", "Include parents", true)
    .option("--absolute", "Show absolute path", false)
    .option("--depth <depth>", "Specify the depth to search", undefined)
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
      console.log("📋 Dependency List 📋\n");
      const file = path.resolve(target);

      if (!fs.existsSync(file)) {
        console.error("Target File does not exist.");
        process.exit(1);
      }

      if (!fs.existsSync(options.targetDir)) {
        console.error("Target Directory does not exist.");
        process.exit(1);
      }

      if (options.aliasResolver instanceof Error) {
        console.error(options.aliasResolver.message);
        process.exit(1);
      }

      if (options.depth != null && !isIntegerStr(options.depth)) {
        console.error("Depth must be a number.");
        process.exit(1);
      }

      const spinner = ora({
        text: "Analyzing...",
        isEnabled: true,
      }).start();

      const relationList = genFileRelation({
        targetDir: options.targetDir,
        ignorePatterns: options.ignorePatterns,
        aliasResolver: options.aliasResolver,
      });

      spinner.succeed("Analysis Complete !!");

      if (options.children) {
        console.log("\n👶 Children List 👶");
        const list = getChildrenList(
          relationList,
          file,
          parseSafeInt(options.depth),
        );
        printList(
          list.map((item) => item.key),
          options.absolute,
        );
      }

      if (options.parents) {
        console.log("\n🎅 Parents List 🎅");
        const list = getParentsList(
          relationList,
          file,
          parseSafeInt(options.depth),
        );
        printList(
          list.map((item) => item.key),
          options.absolute,
        );
      }
    });
};
