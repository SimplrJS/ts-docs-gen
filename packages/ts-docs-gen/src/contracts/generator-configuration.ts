import { ExtractDto } from "ts-extractor";
import { LogLevel } from "simplr-logger";

import { PluginRegistry } from "../registries/plugin-registry";
import { Plugin } from "./plugin";

export interface GeneratorConfiguration {
    OutputDirectory: string;
    PluginManager: PluginRegistry;
    ExtractedData: ExtractDto;
    SkipTableOfContents: boolean;
}

export interface WorkingGeneratorConfiguration {
    outputDirectory: string;
    projectDirectory: string;
    plugins: Plugin[];
    /**
     * File locations that should not be included in extracted data.
     */
    exclude: string[];
    /**
     * Package names to include in extracted data.
     */
    externalPackage: string[];
    outputPathSeparator: string;
    /**
     * Excludes items that has access modifier set to "private" or JSDoc tag "@private".
     */
    excludePrivateApi: boolean;
    verbosity: LogLevel;
    /**
     * Don't create table of contents
     */
    skipTableOfContents: boolean;
}
