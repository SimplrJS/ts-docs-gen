import { Contracts, ExtractDto } from "ts-extractor";

import { BaseApiItemClass } from "../abstractions/base-api-item";
import { GeneratorHelpers } from "../generator-helpers";
import { SerializedApiDefinition, SerializedApiType } from "../contracts/serialized-api-item";
import { Helpers } from "../utils/helpers";
import { ApiTypeParameter } from "./definitions/api-type-parameter";

export type ApiItemWithTypeParameters = Contracts.ApiBaseItemDto & { TypeParameters: Contracts.ApiItemReference[] };

/**
 * Base definition class with helper functions.
 */
export abstract class ApiDefinitionBase<TKind extends Contracts.ApiBaseItemDto = Contracts.ApiBaseItemDto> extends BaseApiItemClass<TKind>
    implements SerializedApiDefinition<TKind> {
    constructor(extractedData: ExtractDto, apiItem: TKind) {
        super(extractedData, apiItem);

        this.parentItem = this.GetSerializedApiDefinition(this.Data.ParentId);
    }

    private parentItem: SerializedApiDefinition | undefined;

    public get ParentItem(): SerializedApiDefinition | undefined {
        return this.parentItem;
    }

    protected GetSerializedApiDefinition(referenceId?: string): SerializedApiDefinition | undefined {
        if (referenceId == null) {
            return undefined;
        }

        const apiItem = this.ExtractedData.Registry[referenceId];
        return GeneratorHelpers.SerializeApiDefinition(this.ExtractedData, apiItem);
    }

    protected GetTypeParameters(apiItem: ApiItemWithTypeParameters): ApiTypeParameter[] {
        return GeneratorHelpers
            .GetApiItemsFromReference<Contracts.ApiTypeParameterDto>(this.ExtractedData, apiItem.TypeParameters)
            .map(x => new ApiTypeParameter(this.ExtractedData, x));
    }

    protected TypeParametersToString(apiItem: ApiItemWithTypeParameters): string {
        const members = this.GetTypeParameters(apiItem)
            .map(x => x.ToText())
            .join(", ");

        return `<${members}>`;
    }

    protected GetMembers(members: Contracts.ApiItemReference[]): SerializedApiDefinition[] {
        return GeneratorHelpers.GetApiItemsFromReference(this.ExtractedData, members)
            .map(x => GeneratorHelpers.SerializeApiDefinition(this.ExtractedData, x))
            .filter<SerializedApiDefinition>((x): x is SerializedApiDefinition => x != null);
    }

    protected MembersToText(members: SerializedApiDefinition[], tab: number = 0): string[] {
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
