import * as fs from "fs-extra";
import * as path from "path";

import { Logger } from "./utils/logger";
import { TestsGenerator } from "./tests-generator";
import { FixSep, TESTS_DIR_NAME, CASES_DIR_NAME } from "./tests-helpers";
import { TestsCleanup } from "./tests-cleanup";
import { CLIHandler } from "./cli-arguments";
import { CLIArgumentsObject } from "./cli-contracts";

async function StartWatcher(testsCasesPath: string): Promise<fs.FSWatcher> {
    return fs.watch(`${testsCasesPath}/`, async (event, fileName) => {
        if (fileName.indexOf(TESTS_DIR_NAME) === -1) {
            Logger.Info(`Test file was changed in "${testsCasesPath}/${fileName}".`);
            const startBuild = Logger.Info(`Generating tests for "${testsCasesPath}"...`);
            await TestsGenerator(testsCasesPath);
            Logger.Debug(`Generated tests after ${(Date.now() - startBuild)}ms`);
        }
    });
}

(async (argumentsObject: CLIArgumentsObject) => {
    const cwd = argumentsObject.path || process.cwd();
    const testsCasesPath = FixSep(path.join(cwd, TESTS_DIR_NAME, CASES_DIR_NAME));

    Logger.Info("Starting test generator...");
    const startRemove = Logger.Info(`Removing old tests from "${testsCasesPath}"...`);
    await TestsCleanup(testsCasesPath);
    Logger.Debug(`Removed old tests after ${(Date.now() - startRemove)}ms`);

    const startBuild = Logger.Info(`Generating tests for "${testsCasesPath}"...`);
    await TestsGenerator(testsCasesPath);
    Logger.Debug(`Generated tests after ${(Date.now() - startBuild)}ms`);

    if (process.argv.indexOf("--watchAll") !== -1) {
        Logger.Info(`Started watching "${testsCasesPath}" tests.`);
        StartWatcher(testsCasesPath);
    }
})(CLIHandler);
