export abstract class AbstractBoo {
    public readonly abstract DefaultBooMessage: string = "Some string with a BooMessage...";

    public abstract BooMessage: string;

    public abstract BooTheMessage(): string;

    public abstract AbstractBooMember?: string;
}

export class Boo extends AbstractBoo {
    public DefaultBooMessage: string;

    constructor() {
        super();
        this.DefaultBooMessage = "Hello World";
        this.BooMessage = " And more...";
    }

    public BooMessage: string;
    public BooTheMessage(): string {
        return this.BooMessage;
    }

    public AbstractBooMember?: string | undefined;
}
