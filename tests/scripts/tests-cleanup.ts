import * as path from "path";
import * as fs from "fs-extra";
import fastGlob from "fast-glob";

import { TESTS_DIR_NAME, TESTS_SNAPSHOTS_DIR_NAME } from "../scripts/tests-helpers";

export async function TestsCleanup(dirName: string): Promise<void> {
    const oldTestFiles = await fastGlob([
        `./${dirName}/${TESTS_DIR_NAME}/*.*`,
        `./${dirName}/${TESTS_DIR_NAME}/**/`,
        `!./${dirName}/**/${TESTS_SNAPSHOTS_DIR_NAME}/`,
        `!./${dirName}/${TESTS_DIR_NAME}/`
    ]);

    for (const pathname of oldTestFiles) {
        await fs.remove(pathname);
    }
}
