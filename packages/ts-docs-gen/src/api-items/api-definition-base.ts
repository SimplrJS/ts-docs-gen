import { Contracts } from "ts-extractor";

import { BaseApiItemClass } from "../abstractions/base-api-item";
import { GeneratorHelpers } from "../generator-helpers";
import { SerializedApiDefinition } from "../contracts/base-api-item";
import { Helpers } from "../utils/helpers";
import { ApiTypeParameter } from "./definitions/api-type-parameter";

export type ApiItemWithTypeParameters = Contracts.ApiBaseItemDto & { TypeParameters: Contracts.ApiItemReference[] };

/**
 * Base class with helper functions.
 */
export abstract class ApiDefinitionBase<TKind extends Contracts.ApiBaseItemDto> extends BaseApiItemClass<TKind>
    implements SerializedApiDefinition<TKind> {
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
            .map(x => GeneratorHelpers.SerializeApiItem(this.ExtractedData, x))
            .filter<SerializedApiDefinition>((x): x is SerializedApiDefinition => x != null);
    }

    protected MembersToText(members: Contracts.ApiItemReference[], tab: number = 0): string[] {
        return Helpers.Flatten(
            this.GetMembers(members)
                .map(x => x.ToText().map(y => `${GeneratorHelpers.Tab(tab)}${y}`))
        );
    }

    public abstract ToText(alias?: string): string[];
    public abstract ToHeadingText(alias?: string): string;
}
