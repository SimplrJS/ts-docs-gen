import * as path from "path";

export namespace Helpers {
    export function Flatten(arr: any[][]): any[] {
        return arr.reduce((flat, toFlatten) =>
            flat.concat(Array.isArray(toFlatten) ? Flatten(toFlatten) : toFlatten), []);
    }

    export function HeadingToAnchor(heading: string): string {
        return heading.trim().toLowerCase().replace(/[^\w\- ]+/g, "").replace(/\s/g, "-").replace(/\-+$/, "");
    }

    export function IsPackageName(text: string): boolean {
        return (!path.isAbsolute(text) && text.indexOf("./") === -1 && text.indexOf("../") === -1);
    }
}
