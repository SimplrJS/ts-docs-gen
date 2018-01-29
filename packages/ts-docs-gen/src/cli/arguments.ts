import * as yargs from "yargs";

export interface CliArguments extends yargs.Arguments {
    project: string;
    output?: string;
    entryFile: string[];
    plugin?: string[];
}

/**
 * Handles all CLI commands and arguments.
 */
export const ArgsHandler = yargs
    .showHelpOnFail(true)
    .help("h", "Show help")
    .alias("h", "help")
    .version()
    .alias("v", "version")
    // CLI options
    .option("project", {
        describe: "Project location.",
        type: "string"
    })
    .alias("p", "project")
    .required("p", "Project location is required.")
    .option("entryFile", {
        describe: "Entry file or files to generate documentation from.",
        type: "array"
    })
    .option("output", {
        describe: "Documentation output directory.",
        type: "string"
    })
    .alias("o", "output")
    .option("plugin", {
        describe: "Package name or path to plugin.",
        type: "array"
    })
    .argv as CliArguments;
