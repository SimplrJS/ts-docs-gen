import * as fs from "fs-extra";
import * as path from "path";

import { BasePackage } from "./cli-contracts";

/**
 * Path from current file to a `package.json`.
 */
const PACKAGE_JSON_PATH = "../package.json";

/**
 * Object of `package.json`.
 */
export const PACKAGE_JSON = fs.readJSONSync(path.join(__dirname, PACKAGE_JSON_PATH)) as BasePackage;

/**
 * Get version string from `package.json`.
 */
export function GetVersion(): string {
    return PACKAGE_JSON.version;
}
