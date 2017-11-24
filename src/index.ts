import * as path from "path";

import { GetCompilerOptions } from "ts-extractor";
import { Generator } from "./generator";

async function main(): Promise<void> {
    const projectDirectory = path.resolve(__dirname, "../examples/simple/");
    const compilerOptions = await GetCompilerOptions(path.join(projectDirectory, "tsconfig.json"));

    const generator = new Generator({
        ExtractorOptions: {
            CompilerOptions: compilerOptions,
            ProjectDirectory: projectDirectory,
            Exclude: []
        },
        Plugins: []
    });

    generator.Generate(["./index.ts"], path.join());
}

main();
