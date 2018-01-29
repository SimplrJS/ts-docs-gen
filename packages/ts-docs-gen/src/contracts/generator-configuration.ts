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
    exclude: string[];
    outputPathSeparator: string;
}
