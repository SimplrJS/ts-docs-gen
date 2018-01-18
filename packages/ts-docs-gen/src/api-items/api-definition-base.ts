import { Contracts, ExtractDto } from "ts-extractor";

import { BaseApiItemClass } from "../abstractions/base-api-item";
import { GeneratorHelpers } from "../generator-helpers";
import { SerializedApiDefinition } from "../contracts/serialized-api-item";
import { Helpers } from "../utils/helpers";
import { ApiItemReference } from "../contracts/api-item-reference";
import { ApiDefinitions } from "./api-definition-list";
import { ApiTypes } from "./api-type-list";

/**
 * Base definition class with helper functions.
 */
export abstract class ApiDefinitionBase<TKind extends Contracts.ApiBaseItemDto = Contracts.ApiBaseItemDto> extends BaseApiItemClass<TKind>
    implements SerializedApiDefinition<TKind> {
    constructor(extractedData: ExtractDto, apiItem: TKind, private reference: ApiItemReference) {
        super(extractedData, apiItem);

        if (this.Data.ParentId != null) {
            const parentReference = { Alias: "", Id: this.Data.ParentId };
            this.parentItem = this.GetSerializedApiDefinition(parentReference);
        }
    }

    public get Reference(): ApiItemReference {
        return this.reference;
    }

    private parentItem: ApiDefinitions | undefined;

    public get ParentItem(): ApiDefinitions | undefined {
        return this.parentItem;
    }

    protected GetSerializedApiDefinition(reference: ApiItemReference): ApiDefinitions | undefined {
        const apiItem = this.ExtractedData.Registry[reference.Id];
        return GeneratorHelpers.SerializeApiDefinition(this.ExtractedData, apiItem, reference);
    }

    protected TypeParametersToString(apiTypeParameters: ApiDefinitionBase[]): string {
        const members = apiTypeParameters
            .map(x => x.ToText())
            .join(", ");

        return `<${members}>`;
    }

    protected GetMembers(members: Contracts.ApiItemReference[]): ApiDefinitions[] {
        return GeneratorHelpers
            .GetApiItemReferences(this.ExtractedData, members)
            .map<[ApiItemReference, Contracts.ApiItemDto]>(x => [x, this.ExtractedData.Registry[x.Id]])
            .map(([reference, apiItem]) => GeneratorHelpers.SerializeApiDefinition(this.ExtractedData, apiItem, reference));
    }

    protected MembersToText(members: ApiDefinitions[], tab: number = 0): string[] {
        return Helpers.Flatten(
            members.map(x => x.ToText().map(y => `${GeneratorHelpers.Tab(tab)}${y}`))
        );
    }

    protected SerializedTypeToString(apiType: ApiTypes | undefined): string {
        if (apiType == null) {
            return "???";
        }

        return apiType.ToText().join(" ");
    }

    public abstract ToText(): string[];
    public abstract ToHeadingText(): string;
}
