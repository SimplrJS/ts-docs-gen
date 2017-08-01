export interface Foo {
    Name: string;
    Surname: string;
}

export interface Bar extends Foo {
    Email: string;
}

export class FooBar {
    private bar: Bar;

    public GetSomething(): string {
        return "Something";
    }

    public SetBar(bar: Bar): void {
        this.bar = bar;
    }
}
