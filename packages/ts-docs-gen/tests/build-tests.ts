import * as os from "os";
import * as process from "process";
import * as fs from "fs-extra";
import { Logger } from "../src/utils/logger";

import { TestsGenerator } from "./scripts/tests-generator";
import { TestsCleanup } from "./scripts/tests-cleanup";
import { TESTS_DIR_NAME } from "./scripts/tests-helpers";

async function StartWatcher(dirName: string): Promise<fs.FSWatcher> {
    return fs.watch(`./${dirName}/`, async (event, fileName) => {
        if (fileName.indexOf(TESTS_DIR_NAME) === -1) {
            Logger.Info(`Test file was changed in "${dirName}/${fileName}".`);
            const startBuild = Logger.Info(`Generating tests for "${dirName}"...`);
            await TestsGenerator(dirName, __dirname);
            Logger.Debug(`Generated tests after ${(Date.now() - startBuild)}ms`);
        }
    });
}

(async (dirNames: string[]) => {
    Logger.Info("Starting test generator...");
    for (const dirName of dirNames) {
        const startRemove = Logger.Info(`Removing old tests from "${dirName}"...`);
        await TestsCleanup(dirName);
        Logger.Debug(`Removed old tests after ${(Date.now() - startRemove)}ms`);

        const startBuild = Logger.Info(`Generating tests for "${dirName}"...`);
        await TestsGenerator(dirName, __dirname);
        Logger.Debug(`Generated tests after ${(Date.now() - startBuild)}ms`);

        if (process.argv.indexOf("--watchAll") !== -1) {
            Logger.Info(`Started watching "${dirName}" tests.`);
            StartWatcher(dirName);
        }
    }
})(["cases"]);
