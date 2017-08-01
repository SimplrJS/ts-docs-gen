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
}

/**
 * @public
 */
export class FooBar {
    private bar: Bar;

    public GetSomething(): string {
        return "Something";
    }

    public SetBar(bar: Bar): void {
        this.bar = bar;
    }
}
