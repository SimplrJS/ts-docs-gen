// https://www.typescriptlang.org/docs/handbook/declaration-merging.html
export namespace Validation {
    export interface StringValidator {
        isAcceptable(s: string): boolean;
    }
}

export namespace Validation {
    const lettersRegexp = /^[A-Za-z]+$/;
    export class LettersOnlyValidator implements StringValidator {
        public isAcceptable(s: string): boolean {
            return lettersRegexp.test(s);
        }
    }
}

export namespace Validation {
    const numberRegexp = /^[0-9]+$/;
    export class ZipCodeValidator implements StringValidator {
        public isAcceptable(s: string): boolean {
            return s.length === 5 && numberRegexp.test(s);
        }
    }
}
