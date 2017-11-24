import { Contracts } from "ts-extractor";

export interface GeneratorOptions {
    // TODO: Implement Plugins system.
    Plugins: string[];
    ExtractorOptions: Contracts.ExtractorOptions;
}
