import * as os from "os";
import * as path from "path";
import * as fs from "fs-extra";
import fastGlob from "fast-glob";
import * as ts from "typescript";

import { FixSep, Tab, TESTS_DIR_NAME } from "./tests-helpers";

export const EXTRACTOR_COMPILER_OPTIONS: ts.CompilerOptions = {
    target: ts.ScriptTarget.Latest,
    module: ts.ModuleKind.CommonJS,
    skipLibCheck: true,
    skipDefaultLibCheck: true
};

export interface Configuration {
    EntryFiles: string[];
}

export async function TestsGenerator(dirName: string, cwd: string): Promise<void> {
    const filesList = await fastGlob([
        `./${dirName}/**/*.ts`,
        `!./${dirName}/${TESTS_DIR_NAME}/**/*`
    ]);

    for (const file of filesList) {
        const { dir, name, base, ext } = path.parse(file);

        const projectDirectory = FixSep(path.join(cwd, dir, "."));
        const testConfigPath = FixSep(path.join(projectDirectory, "test-config.json"));
        const testConfig = await fs.readJSON(testConfigPath) as Configuration;
        const testDescribe = [
            `import { Generator } from "@src/generator";`,
            "",
            `test("${name}", () => {`,
            Tab(1) + `const projectDirectory = "${projectDirectory}";`,
            Tab(1) + `const entryFiles  = ${JSON.stringify(testConfig.EntryFiles)};`,
            "",
            Tab(1) + `expect(true).toBe(true);`,
            `});`,
            ""
        ].join(os.EOL);

        const targetDirectory = path.join(dir, "..", "__tests__");
        await fs.ensureDir(targetDirectory);
        const targetFilePathname = path.join(targetDirectory, `${path.parse(dir).name}.test${ext}`);
        await fs.writeFile(targetFilePathname, testDescribe);
    }
}
