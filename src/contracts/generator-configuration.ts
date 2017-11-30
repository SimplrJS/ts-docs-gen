import { ExtractDto } from "ts-extractor";

import { ApiItemPluginBase } from "../abstractions/api-item-plugin-base";
import { PluginRegistry } from "../registries/plugin-registry";

export interface GeneratorConfiguration {
    OutputDirectory: string;
    PluginManager: PluginRegistry;
    ExtractedData: ExtractDto;
}

export interface WorkingGeneratorConfiguration {
    OutputDirectory: string;
    ProjectDirectory: string;
    Plugins: ApiItemPluginBase[];

    Exclude: string[];
    OutputPathSeparator: string;
}
