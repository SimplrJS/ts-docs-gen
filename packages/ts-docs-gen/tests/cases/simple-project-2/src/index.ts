export { Foo } from "./foo";

export interface Start {
    HandleMessage(message: string): string;
}

export class FooStart implements Start {
    public HandleMessage(message: string): string {
        return message;
    }
}

export class BooStart extends FooStart {
    private defaultMessage: string = "This is a default message.";
}
