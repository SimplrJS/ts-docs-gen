// This is debug file. DO NOT include in compiled package.
import * as path from "path";

import { GeneratorConfigurationBuilder } from "./builders/generator-configuration-builder";
import { Generator } from "./generator";

async function Main(): Promise<void> {
    const projectDirectory = path.join(process.cwd(), "./examples/simple/");
    const entryFiles = ["./index.ts", "./exported-const-variables.ts", "./exported-functions.ts"];

    const configPromise = new GeneratorConfigurationBuilder(projectDirectory).Build(entryFiles);
    const config = await configPromise;

    const generator = new Generator(config);
    const renderedData = generator.GetRenderedData();
    console.log(renderedData);
    debugger;
}

Main();
