import * as ts from "typescript";
import { Extractor } from "@microsoft/api-extractor";
import { ApiJsonGenerator, ExtractedApiJson } from "./api-json-generator";

export class APIExtractor {
    private extractor: Extractor;

    constructor(private compilerOptions: ts.CompilerOptions) {
        /**
         * We need to ignore @types in these tests
         * @see https://github.com/Microsoft/web-build-tools/wiki/API-Extractor-~-Enabling-for-your-project
         */
        this.compilerOptions.typeRoots = ["./"];

        this.extractor = new Extractor({
            compilerOptions: this.compilerOptions
        });
    }

    /**
     * Invoke the compiler engine to perform semantic analysis,
     * and then build up the API Extractor data set.
     * @param entryPoint The entry point for your project
     * @param otherFiles Any other implicitly included files, e.g. typings/tsd.d.ts is sometimes needed here
     */
    public Analyze(entryPoint: string, otherFiles: string[]): void {
        this.extractor.analyze({
            entryPointFile: entryPoint,
            otherFiles: otherFiles
        });
    }

    public JSONGenerator(): ExtractedApiJson {
        const apiJsonGenerator = new ApiJsonGenerator();
        return apiJsonGenerator.GetFileContents(this.extractor);
    }
}
