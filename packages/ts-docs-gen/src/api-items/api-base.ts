import { Contracts } from "ts-extractor";

import { BaseApiItemClass } from "../abstractions/base-api-item";
import { GeneratorHelpers } from "../generator-helpers";
import { ApiTypeParameter } from "./api-type-parameter";

export type ApiItemWithTypeParameters = Contracts.ApiBaseItemDto & { TypeParameters: Contracts.ApiItemReference[] };

/**
 * Base class with helper functions.
 */
export abstract class ApiBase<TKind extends Contracts.ApiBaseItemDto> extends BaseApiItemClass<TKind> {
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
}
