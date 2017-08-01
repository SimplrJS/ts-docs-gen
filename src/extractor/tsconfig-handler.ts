import * as fs from "mz/fs";
import * as path from "path";
import * as ts from "typescript";

import { ParseConfigHost } from "./parse-config-host";

export async function ReadTsconfig(fileLocation: string): Promise<ts.ParsedCommandLine> {
    const rawContent = fs.readFile(fileLocation, "utf-8");
    const parseConfigHost = new ParseConfigHost();
    const configContent = ts.parseJsonConfigFileContent(rawContent, parseConfigHost, path.dirname(fileLocation));

    return configContent;
}
