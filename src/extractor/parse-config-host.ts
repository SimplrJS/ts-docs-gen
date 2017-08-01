import * as fs from "fs";
import * as ts from "typescript";

export class ParseConfigHost implements ts.ParseConfigHost {
    public useCaseSensitiveFileNames: boolean = true;

    public readFile(path: string): string {
        return ts.sys.readFile(path);
    }

    public readDirectory(rootDir: string, extensions: string[], excludes: string[], includes: string[]): string[] {
        return ts.sys.readDirectory(rootDir, extensions, excludes, includes);
    }

    /**
     * Gets a value indicating whether the specified path exists and is a file.
     * @param path The path to test.
     */
    public fileExists(path: string): boolean {
        return fs.existsSync(path);
    }
}
