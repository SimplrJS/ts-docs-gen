/**
 * @param a First list.
 * @param b Second list that will be compared with first list.
 * @param ignoreValues Values that can be ignored from first list.
 * @return An array of missing elements in second list.
 */
export function CheckLists(a: string[], b: string[], ignoreValues?: string[]): string[] {
    const result: string[] = [];
    for (const value of a) {
        if (ignoreValues != null && ignoreValues.findIndex(x => x === value) !== -1) {
            continue;
        }

        if (b.findIndex(x => x === value) === -1) {
            result.push(value);
        }
    }

    return result;
}
