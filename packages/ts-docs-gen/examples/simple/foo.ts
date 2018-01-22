export interface MessageDto<T> {
    Message: T;
    Time: string;
}

// TODO: type parameters description.
/**
 * General comment about class Foo.
 *
 * @template T Message type
 */
export class Foo {
    // TODO: check comments on suffix.
    /**
     * Some constructor.
     *
     * @param suffix Suffix of message.
     */
    constructor(suffix: string | undefined) {
        if (suffix == null) {
            return;
        }

        this.messageSuffix = suffix;
        this.IsSuffixSet = true;
    }

    // #region Methods

    /**
     * private static method `getTimeString` comment.
     */
    private static getTimeString(): string {
        return new Date().toISOString();
    }

    /**
     * public static method `DefaultMessageTypeString` comment.
     */
    public static DefaultMessageTypeString(): string {
        return "string";
    }

    private resolveMessageDto<T = {}>(message: T, time?: string): MessageDto<T> {
        return {
            Message: message,
            Time: time || Foo.getTimeString()
        };
    }

    /**
     * @param message Message text.
     */
    public GetMessage(message: string): string {
        return this.defaultMessage;
    }

    // TODO: fix falsy escaped characters in complex types links.
    // tslint:disable-next-line:no-empty
    public PrintMessage<T extends Object>(messageDto: MessageDto<T>): void { }

    public ResolveSimpleMessageObject<T>(message: T): { Message: T } {
        return {
            Message: message
        };
    }
    // #endregion Methods

    // #region Properties

    /**
     * public static property `Name` comment.
     * @deprecated
     */
    public static Name: string = "Foo class";

    private static internalName: string = "Foo class";

    /**
     * private readonly method `defaultMessage` comment.
     */
    private readonly defaultMessage: string = "It's a default message.";

    /**
     * @beta v0.0.0-beta
     */
    private messageSuffix: string | undefined;

    public IsSuffixSet?: boolean = false;

    // #endregion Properties

    // #region Getters
    public get DefaultMessage(): string {
        return `<${Foo.DefaultMessageTypeString()}> ${this.defaultMessage} - ${this.getMessageSuffix}`;
    }

    private get getMessageSuffix(): string {
        return "Is a suffix.";
    }
    // #endregion Getters

    // #region Setters
    private set setMessageSuffix(value: string | undefined) {
        this.messageSuffix = value;
    }

    /**
     * @param suffix Message suffix.
     */
    public set SetDefaultSuffix(suffix: string) {
        this.messageSuffix = suffix;
    }
    // #endregion Setters

}
