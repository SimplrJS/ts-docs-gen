import * as yargs from "yargs";

import { GetVersion } from "./cli-helpers";
import { CLIArgumentsObject } from "./cli-contracts";

/**
 * Handles all CLI commands and arguments.
 */
export const CLIHandler = yargs
    .showHelpOnFail(true)
    .help("h", "Show help")
    .alias("h", "help")
    .version(`Current version: ${GetVersion()}`)
    .alias("v", "version")
    // CLI options
    .option("project", {
        describe: "Project directory path.",
        type: "string"
    })
    .alias("p", "project")
    .argv as CLIArgumentsObject;
