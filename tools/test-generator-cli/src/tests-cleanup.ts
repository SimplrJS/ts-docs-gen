import * as fs from "fs-extra";
import * as path from "path";
import fastGlob from "fast-glob";

import {
    GENERATED_TESTS_DIR_NAME,
    TESTS_SNAPSHOTS_DIR_NAME,
    FixSep
} from "./tests-helpers";

export async function TestsCleanup(testsCasesPath: string): Promise<void> {
    const generatedTestsDirPath = FixSep(path.join(testsCasesPath, GENERATED_TESTS_DIR_NAME));

    const oldTestFiles = await fastGlob(`${generatedTestsDirPath}/**/*`, {
        onlyFiles: true,
        ignore: [`**/${TESTS_SNAPSHOTS_DIR_NAME}/**`]
    });

    for (const pathname of oldTestFiles) {
        await fs.remove(pathname);
    }
}
