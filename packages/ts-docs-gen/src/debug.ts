// This is debug file. DO NOT include in compiled package.
// import * as path from "path";
import { Contracts } from "ts-extractor";

import { GeneratorConfigurationBuilder } from "./builders/generator-configuration-builder";
import { Generator } from "./generator";
import { BasePlugin } from "./abstractions/base-plugin";
import { PluginOptions, SupportedApiItemKindType, PluginResult } from "./contracts/plugin";
import { GeneratorHelpers } from "./generator-helpers";

export class PluginDebug extends BasePlugin {
    public SupportedApiDefinitionKind(): SupportedApiItemKindType[] {
        return [
            GeneratorHelpers.ApiDefinitionKind.Any
        ];
    }

    public Render(options: PluginOptions, apiItem: Contracts.ApiDefinition): PluginResult {
        return {
            ...GeneratorHelpers.GetDefaultPluginResultData(),
            Reference: options.Reference,
            ApiItem: apiItem,
            Result: [
                "# Debug Plugin",
                "",
                `${apiItem.Name}: ${apiItem.ApiKind}`
            ]
        };
    }
}

async function Main(): Promise<void> {
    const projectDirectory = process.cwd();
    const entryFiles = ["./src/index.ts"];
    // const projectDirectory = path.join(process.cwd(), "./examples/simple/");
    // const entryFiles = ["./index.ts", "./exported-const-variables.ts", "./exported-functions.ts"];

    const configPromise = new GeneratorConfigurationBuilder(projectDirectory)
        .Build(entryFiles);
    const config = await configPromise;

    const generator = new Generator(config);
    // tslint:disable-next-line:no-console
    // console.log(generator.OutputData);
    // tslint:disable-next-line:no-debugger
    await generator.WriteToFiles();
}

Main();
