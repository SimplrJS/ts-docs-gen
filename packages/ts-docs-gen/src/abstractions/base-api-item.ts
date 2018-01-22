import { ExtractDto } from "ts-extractor";
import { SerializedApiItem, ReferenceRenderHandler } from "../contracts/serialized-api-item";

export abstract class BaseApiItemClass<TKind> implements SerializedApiItem<TKind> {
    constructor(private extractedData: ExtractDto, private apiItem: TKind) { }

    protected get ExtractedData(): ExtractDto {
        return this.extractedData;
    }

    public get ApiItem(): TKind {
        return this.apiItem;
    }

    protected DefaultReferenceRenderer: ReferenceRenderHandler = name => name;

    public abstract ToText(render?: ReferenceRenderHandler): string[];

    public ToInlineText(render: ReferenceRenderHandler = this.DefaultReferenceRenderer): string {
        return this.ToText(render)
            .map(x => x.trim())
            .join(" ");
    }
}
