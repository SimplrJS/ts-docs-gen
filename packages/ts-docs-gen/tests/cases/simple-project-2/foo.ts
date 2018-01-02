export class Foo {
    public GetMessage(message: string): string {
        return this.defaultMessage;
    }

    private readonly defaultMessage: string = "It's a default message.";
}
