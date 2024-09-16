import { Command } from "commander";
import { createCommand } from "./commands";

const run = async () => {
  const program = new Command()
    .version("0.0.1")
    .description("depon CLI tool");

  createCommand(program);

  program.parse(process.argv);
};

run();
