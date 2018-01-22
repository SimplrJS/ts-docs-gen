// TODO: add classes to table of contents.

export { Foo } from "./foo";

export interface Start {
    HandleMessage(message: string): string;
}

// TODO: add link of implemented interfaces.
export class FooStart implements Start {
    public HandleMessage(message: string): string {
        return message;
    }
}

// TODO: add link of extended class
export class BooStart extends FooStart {
    private defaultMessage: string = "This is a default message.";
}
