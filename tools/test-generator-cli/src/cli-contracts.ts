import { Arguments } from "yargs";

/**
 * Base properties of `package.json`.
 */
export interface BasePackage {
    name: string;
    version: string;
    description?: string;
    main: string;
    author?: string;
    license?: string;
}

/**
 * Argument of CLI.
 */
export interface CLIArgumentsObject extends Arguments {
    path?: string;
}
