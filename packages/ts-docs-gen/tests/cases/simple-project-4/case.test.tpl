import * as path from "path";
import { ModuleKind, ScriptTarget } from "typescript";
import { Generator } from "@src/generator";
import { GeneratorConfigurationBuilder } from "@src/builders/generator-configuration-builder";
import { VariablePlugin } from "../simple-project-4/src/variable-plugin";

test("{{caseName}}", async done => {
    const projectDirectory = "{{projectDirectory}}";
    const testConfig = {{{json testConfig}}};
    const entryFiles = testConfig.EntryFiles;

    try {
        const myCompilerOptions = {
            module: ModuleKind.CommonJS,
            target: ScriptTarget.ES2015,
            removeComments: false,
            outDir: "dist",
            rootDir: "src",
            inlineSourceMap: true,
            inlineSources: true,
            skipDefaultLibCheck: true,
            declaration: true,
            pretty: true,
            strict: false,
            forceConsistentCasingInFileNames: true,
            lib: [
                "es6",
                "dom"
            ],
            typeRoots: [
                "../../../../node_modules/@types"
            ]
        };

        const configuration = await new GeneratorConfigurationBuilder(projectDirectory)
            .AddPlugins([new VariablePlugin])
            .OverrideCompilerOptions(myCompilerOptions)
            .OverrideConfiguration({
                projectDirectory: path.join(projectDirectory, "src/project-to-doc/custom"),
                exclude: ["./to-exclude.ts"]
            })
            .SetOutputDirectory("./docs")
            .Build(entryFiles);

        const generator = new Generator(configuration);

        expect(generator.OutputData).toMatchSnapshot();
        done();
    } catch (error) {
        done.fail(error);
    }
});
