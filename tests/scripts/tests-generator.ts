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

export async function TestsGenerator(dirName: string, cwd: string): Promise<void> {
    const filesList = await fastGlob([
        `./${dirName}/**/*.ts`,
        `!./${dirName}/${TESTS_DIR_NAME}/**/*`
    ]);

    for (const file of filesList) {
        const { dir, name, base, ext } = path.parse(file);

        const moduleName = FixSep(path.join(dir, base));

        const testDescribe = [
            `import { Extractor } from "@src/extractor";`,
            "",
            `test("${name}", () => {`,
            Tab(1) + `const moduleName = "./${moduleName}";`,
            Tab(1) + `const projectDirectory = "${FixSep(cwd)}";`,
            "",
            Tab(1) + `const extractor = new Extractor({`,
            Tab(2) + `CompilerOptions: ${JSON.stringify(EXTRACTOR_COMPILER_OPTIONS, undefined, Tab(3))},`,
            Tab(2) + `ProjectDirectory: projectDirectory`,
            Tab(1) + `});`,
            "",
            Tab(1) + `expect(extractor.Extract([moduleName])).toMatchSnapshot();`,
            `});`,
            ""
        ].join(os.EOL);

        const targetDirectory = path.join(dir, "__tests__");
        await fs.ensureDir(targetDirectory);
        const targetFilePathname = path.join(targetDirectory, `${name}.test${ext}`);
        await fs.writeFile(targetFilePathname, testDescribe);
    }
}
