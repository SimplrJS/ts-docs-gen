export abstract class AbstractBoo {
    // TODO: Maybe implement default value of property.
    public readonly abstract DefaultBooMessage: string = "Some string with a BooMessage...";

    constructor() {
        this.BooMessage = this.DefaultBooMessage;
    }

    public abstract BooMessage: string;

    public abstract BooTheMessage(): string;

    public abstract AbstractBooMember?: string;
}

export class Boo extends AbstractBoo {
    public DefaultBooMessage: string;

    constructor() {
        super();
        this.BooMessage += " And more...";
    }

    public BooMessage: string;
    public BooTheMessage(): string {
        return this.BooMessage;
    }

    // TODO: fix reverted order of union types.
    public AbstractBooMember?: string | undefined;
}
