import { ExtractDto } from "ts-extractor";
import { SerializedApiItem } from "../contracts/serialized-api-item";

export abstract class BaseApiItemClass<TKind> implements SerializedApiItem<TKind> {
    constructor(private extractedData: ExtractDto, private apiItem: TKind) { }

    protected get ExtractedData(): ExtractDto {
        return this.extractedData;
    }

    public get Data(): TKind {
        return this.apiItem;
    }

    public abstract ToText(): string[];
}
