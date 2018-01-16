import { Contracts, ExtractDto } from "ts-extractor";

export abstract class BaseApiItem<TKind extends Contracts.ApiItemDto> {
    constructor(private extractedData: ExtractDto, private apiItem: TKind) { }

    protected get ExtractedData(): ExtractDto {
        return this.extractedData;
    }

    public get Data(): TKind {
        return this.apiItem;
    }

    // TODO: Naming.
    public abstract ToStringArray(alias?: string): string[];

    public ToString(alias?: string): string {
        return this.ToStringArray(alias).join("\n");
    }

    public abstract ToSimpleString(alias?: string): string;
}
