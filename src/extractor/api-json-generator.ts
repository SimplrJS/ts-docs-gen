import { ApiJsonGenerator as Generator, Extractor } from "@microsoft/api-extractor";

export type ExtractedApiJson = {};

export class ApiJsonGenerator extends Generator {
    public GetFileContents(extractor: Extractor): ExtractedApiJson {
        this.visit(extractor.package, this.jsonOutput);

        // TODO: Add JSON validation scheme.

        return this.jsonOutput;
    }
}
