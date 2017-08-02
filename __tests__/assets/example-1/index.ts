/**
 * @public
 */
export interface Foo {
    Name: string;
    Surname: string;
}

/**
 * @public
 */
export interface Bar extends Foo {
    Email: string;
    /**
     * Get Bar model code by id.
     * Another line of summary.
     */
    GetCode(id: number): string;
}

/**
 * @public
 */
export class FooBar {
    private bar: Bar;

    /**
     * Hello Foo summary
     */
    public Foo: string = "Hello";

    public GetSomething(): string {
        return "Something";
    }

    /**
     * Summary of SetBar method.
     */
    public SetBar(bar: Bar): void {
        this.bar = bar;
    }
}

/**
 * @public
 */
export enum Test {
    None = 0,
    Warning = 8,
    Error = 100
}

/**
 * @public
 */
export enum EventType {
    Live = "live",
    Test = "test"
}

/**
 * Sum summary
 * @param a - First number
 * @param b - Second number
 * @returns Return summary.
 * @public
 */
export function Sum(a: number, b: number): number {
    return a + b;
}

/**
 * Package version.
 * @public
 */
export const version = 2.11;

/**
 * @public
 */
export namespace CoolStuff {
    /**
     * Yet another sum function.
     * @public
     */
    export function YetAnotherSumFunc(x: number, y: number): number {
        return x + y;
    }

    export const a: string = "aa";
}
