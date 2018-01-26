import { Contracts, ExtractDto } from "ts-extractor";
import { ReferenceRenderHandler, SerializedApiDefinition } from "../contracts/serialized-api-item";
import { BaseApiItemClass } from "../abstractions/base-api-item";
import { ApiItemReference } from "../contracts/api-item-reference";
import { GeneratorHelpers } from "../generator-helpers";

// Because of circular dependency we had to
// implement interface and not extend ApiDefinitionBase.
export class ApiDefinitionDefault<TKind extends Contracts.ApiBaseDefinition = Contracts.ApiBaseDefinition>
    extends BaseApiItemClass<TKind> implements SerializedApiDefinition<TKind> {

    constructor(extractedData: ExtractDto, apiItem: TKind, private reference: ApiItemReference) {
        super(extractedData, apiItem);
    }

    public get ParentItem(): SerializedApiDefinition<Contracts.ApiDefinition> | undefined {
        if (this.ApiItem.ParentId == null) {
            return undefined;
        }

        const apiItem = this.ExtractedData.Registry[this.ApiItem.ParentId];
        return GeneratorHelpers.SerializeApiDefinition(
            this.ExtractedData,
            this.ApiItem,
            {
                Alias: apiItem.Name,
                Id: this.ApiItem.ParentId
            }
        ) as SerializedApiDefinition<Contracts.ApiDefinition>;
    }

    public get Reference(): ApiItemReference {
        return this.reference;
    }

    public get Name(): string {
        return this.ApiItem.Name;
    }

    public get ApiItem(): TKind {
        return this.ApiItem;
    }

    public ToText(render: ReferenceRenderHandler = this.DefaultReferenceRenderer): string[] {
        return [this.Name];
    }

    public ToInlineText(render?: ReferenceRenderHandler | undefined): string {
        return this.ToText().join(" ");
    }

    public ToHeadingText(): string {
        const name = this.Name;
        return `${this.ApiItem.ApiKind}: ${name}`;
    }
}
