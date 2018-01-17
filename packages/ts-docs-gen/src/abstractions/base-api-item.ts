import { Contracts, ExtractDto } from "ts-extractor";
import { SerializedApiItem } from "../contracts/base-api-item";

export abstract class BaseApiItemClass<TKind extends Contracts.ApiBaseItemDto = Contracts.ApiBaseItemDto>
    implements SerializedApiItem<TKind> {
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
