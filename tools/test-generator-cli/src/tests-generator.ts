import * as os from "os";
import * as path from "path";
import * as fs from "fs-extra";
import fastGlob from "fast-glob";

import {
    FixSep,
    Tab,
    GENERATED_TESTS_DIR_NAME,
    TESTS_CONFIG_FILE_NAME,
    DEFAULT_TEMPLATE_FILE_NAME,
    CASE_TEMPLATE_FILE_NAME
} from "./tests-helpers";
import { Logger } from "./utils/logger";

export interface Configuration {
    EntryFiles: string[];
}

export async function TestsGenerator(testsCasesPath: string): Promise<void> {
    const defaultTemplatePath = FixSep(path.join(testsCasesPath, DEFAULT_TEMPLATE_FILE_NAME));
    if (await fs.pathExists(defaultTemplatePath)) {
        Logger.Error(`Not found package default template. Expected file location: "${defaultTemplatePath}"`);
        return;
    }

    const casesDirPaths = await fastGlob([
        `${testsCasesPath}/*`
    ], {
            onlyDirs: true,
            ignore: [`**/${GENERATED_TESTS_DIR_NAME}/**`]
        });

    const targetDirectory = path.join(testsCasesPath, GENERATED_TESTS_DIR_NAME);
    await fs.ensureDir(targetDirectory);

    for (const caseDirPath of casesDirPaths) {
        const { name } = path.parse(caseDirPath);

        const caseTemplatePath = FixSep(path.join(caseDirPath, CASE_TEMPLATE_FILE_NAME));
        let templatePath: string;
        if (await fs.pathExists(caseTemplatePath)) {
            templatePath = caseTemplatePath;
        } else {
            templatePath = defaultTemplatePath;
        }
        console.log(name, templatePath);

        const testConfigPath = FixSep(path.join(caseDirPath, TESTS_CONFIG_FILE_NAME));
        const testConfig = await fs.readJSON(testConfigPath) as Configuration;

        // TODO: add data to 'testDescribe' from 'templatePath' and fill template with data from 'testConfig'
        const testDescribe = [
            `import { Generator } from "@src/generator";`,
            `import { GeneratorConfigurationBuilder } from "@src/builders/generator-configuration-builder";`,
            "",
            `test("${name}", async done => {`,
            Tab(1) + `const projectDirectory = "${caseDirPath}";`,
            Tab(1) + `const entryFiles  = ${JSON.stringify(testConfig.EntryFiles)};`,
            "",
            Tab(1) + "try {",
            Tab(2) + "const configuration = await new GeneratorConfigurationBuilder(projectDirectory)",
            Tab(3) + ".Build(entryFiles);",
            "",
            Tab(2) + "const generator = new Generator(configuration);",
            "",
            Tab(2) + "expect(generator.OutputData).toMatchSnapshot();",
            Tab(2) + "done();",
            Tab(1) + "} catch (error) {",
            Tab(2) + "done.fail(error);",
            Tab(1) + "}",
            "});",
            ""
        ].join(os.EOL);

        const targetFilePathName = path.join(targetDirectory, `${name}.test.ts`);
        await fs.writeFile(targetFilePathName, testDescribe);
    }
}
