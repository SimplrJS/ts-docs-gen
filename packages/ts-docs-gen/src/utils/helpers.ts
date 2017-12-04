export namespace Helpers {
    export function Flatten(arr: any[][]): any[] {
        return arr.reduce((flat, toFlatten) =>
            flat.concat(Array.isArray(toFlatten) ? Flatten(toFlatten) : toFlatten), []);
    }
}
