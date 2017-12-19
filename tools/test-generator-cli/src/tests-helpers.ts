import * as path from "path";
import * as handlebars from "handlebars";

export function FixSep(pathname: string): string {
    return pathname.split(path.sep).join("/");
}

export function RegisterJSONStringifyHandlebarHelper(): void {
    handlebars.registerHelper("json", (value: any) =>
        new handlebars.SafeString(
            JSON.stringify(value)
        ));
}

export const TESTS_DIR_NAME = "tests";
export const CASES_DIR_NAME = "cases";

export const GENERATED_TESTS_DIR_NAME = "__tests__";
export const TESTS_SNAPSHOTS_DIR_NAME = "__snapshots__";

export const TESTS_CONFIG_FILE_NAME = "test-config.json";
export const DEFAULT_TEMPLATE_FILE_NAME = "default.test.tpl";
export const CASE_TEMPLATE_FILE_NAME = "case.test.tpl";
