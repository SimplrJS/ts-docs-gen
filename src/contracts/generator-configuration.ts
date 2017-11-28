import { ExtractDto } from "ts-extractor";

import { ApiItemPluginBase } from "../abstractions/api-item-plugin-base";
import { PluginManager } from "../managers/plugin-manager";

export interface GeneratorConfiguration {
    OutputDirectory: string;
    EntryFiles: string[];
    PluginManager: PluginManager;
    ExtractedData: ExtractDto;
}

export interface WorkingGeneratorConfiguration {
    OutputDirectory: string;
    ProjectDirectory: string;
    Plugins: ApiItemPluginBase[];

    Exclude: string[];
    OutputPathSeparator: string;
}
