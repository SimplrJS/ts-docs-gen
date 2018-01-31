import * as yargs from "yargs";

export interface CliFlags {
    project: string;
    output?: string;
    entryFile: string[];
    plugin?: string[];
    exclude?: string[];
    externalPackage?: string[];
    excludePrivateApi?: boolean;
}

export type CliArguments = CliFlags & yargs.Arguments;

function flagName(name: keyof CliFlags): string {
    return name;
}

/**
 * Handles all CLI commands and arguments.
 */
export const ArgsHandler = yargs
    .showHelpOnFail(true)
    .help("h", "Show help")
    .alias("h", "help")
    .config()
    .version()
    .alias("v", "version")
    // CLI options
    .option(flagName("project"), {
        alias: "p",
        describe: "Project location.",
        default: process.cwd(),
    })
    .option(flagName("entryFile"), {
        describe: "Entry file or files to generate documentation from.",
        required: true,
        type: "array"
    })
    .option(flagName("externalPackage"), {
        describe: "Package names to include in extracted data.",
        type: "array"
    })
    .option(flagName("exclude"), {
        describe: "File locations that should not be included generated documentation.",
        type: "array"
    })
    .option(flagName("excludePrivateApi"), {
        describe: `Excludes api items that has access modifier set to "private" or JSDoc tag "@private".`,
        default: true,
        type: "boolean"
    })
    .option(flagName("output"), {
        alias: "o",
        describe: "Documentation output directory.",
        type: "string"
    })
    .option(flagName("plugin"), {
        describe: "Package name or path to plugin.",
        type: "array"
    })
    .argv as CliArguments;
