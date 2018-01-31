import { ExtractDto } from "ts-extractor";

import { PluginRegistry } from "../registries/plugin-registry";
import { Plugin } from "./plugin";

export interface GeneratorConfiguration {
    OutputDirectory: string;
    PluginManager: PluginRegistry;
    ExtractedData: ExtractDto;
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
}
