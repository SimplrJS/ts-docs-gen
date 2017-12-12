import * as path from "path";
import * as fs from "fs-extra";
import fastGlob from "fast-glob";
import * as handlebars from "handlebars";

import {
    FixSep,
    GENERATED_TESTS_DIR_NAME,
    TESTS_CONFIG_FILE_NAME,
    DEFAULT_TEMPLATE_FILE_NAME,
    CASE_TEMPLATE_FILE_NAME,
    RegisterJSONStringifyHandlebarHelper
} from "./tests-helpers";
import { Logger } from "./utils/logger";

export interface Configuration {
    EntryFiles: string[];
}

export async function TestsGenerator(testsCasesPath: string): Promise<void> {
    const defaultTemplatePath = FixSep(path.join(testsCasesPath, "..", DEFAULT_TEMPLATE_FILE_NAME));
    if (!await fs.pathExists(defaultTemplatePath)) {
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

    RegisterJSONStringifyHandlebarHelper();

    for (const caseDirPath of casesDirPaths) {
        const { name } = path.parse(caseDirPath);

        const caseTemplatePath = FixSep(path.join(caseDirPath, CASE_TEMPLATE_FILE_NAME));
        let templatePath: string;
        if (await fs.pathExists(caseTemplatePath)) {
            templatePath = caseTemplatePath;
        } else {
            templatePath = defaultTemplatePath;
        }

        const testConfigPath = FixSep(path.join(caseDirPath, TESTS_CONFIG_FILE_NAME));
        const testConfig = await fs.readJSON(testConfigPath) as Configuration;

        const source = await fs.readFile(templatePath, "utf8");
        const template = handlebars.compile(source);
        const data = {
            "caseName": name,
            "projectDirectory": caseDirPath,
            "testConfig": testConfig
        };
        const testDescribe = template(data);

        const targetFilePathName = path.join(targetDirectory, `${name}.test.ts`);
        await fs.writeFile(targetFilePathName, testDescribe);
    }
}
