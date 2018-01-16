import { Contracts, ExtractDto } from "ts-extractor";

export abstract class BaseApiItem<TKind extends Contracts.ApiBaseItemDto = Contracts.ApiBaseItemDto> {
    constructor(private extractedData: ExtractDto, private apiItem: TKind) { }

    protected get ExtractedData(): ExtractDto {
        return this.extractedData;
    }

    public get Data(): TKind {
        return this.apiItem;
    }

    public abstract ToText(alias?: string): string[];

    public abstract ToHeadingText(alias?: string): string;
}
