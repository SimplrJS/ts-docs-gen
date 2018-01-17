import { Contracts, ExtractDto } from "ts-extractor";

import { BaseApiItemClass } from "../abstractions/base-api-item";
import { GeneratorHelpers } from "../generator-helpers";
import { SerializedApiDefinition, SerializedApiType } from "../contracts/serialized-api-item";
import { Helpers } from "../utils/helpers";
import { ApiTypeParameter } from "./definitions/api-type-parameter";
import { ApiItemReference } from "../contracts/api-item-reference";

export type ApiItemWithTypeParameters = Contracts.ApiBaseItemDto & { TypeParameters: Contracts.ApiItemReference[] };

/**
 * Base definition class with helper functions.
 */
export abstract class ApiDefinitionBase<TKind extends Contracts.ApiBaseItemDto = Contracts.ApiBaseItemDto> extends BaseApiItemClass<TKind>
    implements SerializedApiDefinition<TKind> {
    constructor(extractedData: ExtractDto, apiItem: TKind) {
        super(extractedData, apiItem);

        if (this.Data.ParentId != null) {
            const parentReference = { Alias: "", Id: this.Data.ParentId };
            this.parentItem = this.GetSerializedApiDefinition(parentReference);
        }
    }

    private parentItem: SerializedApiDefinition<Contracts.ApiItemDto> | undefined;

    public get ParentItem(): SerializedApiDefinition<Contracts.ApiItemDto> | undefined {
        return this.parentItem;
    }

    protected GetSerializedApiDefinition(reference: ApiItemReference): SerializedApiDefinition<Contracts.ApiItemDto> | undefined {
        const apiItem = this.ExtractedData.Registry[reference.Id];
        return GeneratorHelpers.SerializeApiDefinition(this.ExtractedData, apiItem, reference);
    }

    protected GetTypeParameters(apiItem: ApiItemWithTypeParameters): ApiTypeParameter[] {
        return GeneratorHelpers
            .GetApiItemsFromReferenceList<Contracts.ApiTypeParameterDto>(this.ExtractedData, apiItem.TypeParameters)
            .map(x => new ApiTypeParameter(this.ExtractedData, x));
    }

    protected TypeParametersToString(apiItem: ApiItemWithTypeParameters): string {
        const members = this.GetTypeParameters(apiItem)
            .map(x => x.ToText())
            .join(", ");

        return `<${members}>`;
    }

    protected GetMembers(members: Contracts.ApiItemReference[]): Array<SerializedApiDefinition<Contracts.ApiItemDto>> {
        return GeneratorHelpers
            .GetApiItemReferences(this.ExtractedData, members)
            .map<[ApiItemReference, Contracts.ApiItemDto]>(x => [x, this.ExtractedData.Registry[x.Id]])
            .map(([reference, apiItem]) => GeneratorHelpers.SerializeApiDefinition(this.ExtractedData, apiItem, reference));
    }

    protected MembersToText(members: Array<SerializedApiDefinition<Contracts.ApiItemDto>>, tab: number = 0): string[] {
        return Helpers.Flatten(
            members.map(x => x.ToText().map(y => `${GeneratorHelpers.Tab(tab)}${y}`))
        );
    }

    protected SerializedTypeToString(apiType: SerializedApiType | undefined): string {
        if (apiType == null) {
            return "???";
        }

        return apiType.ToText().join(" ");
    }

    public abstract ToText(alias?: string): string[];
    public abstract ToHeadingText(alias?: string): string;
}
