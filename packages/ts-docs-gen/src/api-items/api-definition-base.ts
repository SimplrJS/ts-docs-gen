import { Contracts, ExtractDto } from "ts-extractor";
import { LogLevel } from "simplr-logger";

import { BaseApiItemClass } from "../abstractions/base-api-item";
import { GeneratorHelpers } from "../generator-helpers";
import { SerializedApiDefinition, ReferenceRenderHandler } from "../contracts/serialized-api-item";
import { ApiItemReference } from "../contracts/api-item-reference";
import { ApiDefinitions } from "./api-definition-list";
import { ApiTypes } from "./api-type-list";

/**
 * Base definition class with helper functions.
 */
export abstract class ApiDefinitionBase<TKind extends Contracts.ApiBaseDefinition = Contracts.ApiBaseDefinition>
    extends BaseApiItemClass<TKind> implements SerializedApiDefinition<TKind> {

    constructor(extractedData: ExtractDto, apiItem: TKind, private reference: ApiItemReference) {
        super(extractedData, apiItem);
    }

    public get Name(): string {
        return this.Reference.Alias || this.ApiItem.Name;
    }

    public get Reference(): ApiItemReference {
        return this.reference;
    }

    private parentItem: ApiDefinitions | undefined;

    public get ParentItem(): ApiDefinitions | undefined {
        if (this.ApiItem.ParentId != null) {
            const parentReference = { Alias: "", Id: this.ApiItem.ParentId };
            this.parentItem = this.GetSerializedApiDefinition(parentReference);
        }

        return this.parentItem;
    }

    protected GetSerializedApiDefinition(reference: ApiItemReference): ApiDefinitions | undefined {
        const apiItem = this.ExtractedData.Registry[reference.Id];
        return GeneratorHelpers.SerializeApiDefinition(this.ExtractedData, apiItem, reference);
    }

    protected TypeParametersToString(render: ReferenceRenderHandler, apiTypeParameters: ApiDefinitionBase[]): string {
        if (apiTypeParameters.length === 0) {
            return "";
        }

        const members = apiTypeParameters
            .map(x => x.ToInlineText(render))
            .join(", ");

        return `<${members}>`;
    }

    protected SerializedTypeToString(render: ReferenceRenderHandler, apiType: ApiTypes | undefined): string {
        if (apiType == null) {
            GeneratorHelpers.LogWithApiItemPosition(LogLevel.Warning, this.ApiItem, "Missing type.");
            return "???";
        }

        return apiType.ToInlineText(render);
    }

    public abstract ToText(render?: ReferenceRenderHandler): string[];
    public abstract ToHeadingText(): string;
}
