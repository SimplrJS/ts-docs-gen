import { Contracts } from "ts-extractor";

import { BaseApiItem } from "../abstractions/base-api-item";
import { GeneratorHelpers } from "../generator-helpers";
import { ApiTypeParameter } from "./api-type-parameter";

/**
 * Base class with helper functions.
 */
export abstract class ApiBase<TKind extends Contracts.ApiBaseItemDto> extends BaseApiItem<TKind> {
    protected GetTypeParameters(typeParameters: Contracts.ApiItemReference[]): ApiTypeParameter[] {
        return GeneratorHelpers
            .GetApiItemsFromReference<Contracts.ApiTypeParameterDto>(this.ExtractedData, typeParameters)
            .map(x => new ApiTypeParameter(this.ExtractedData, x));
    }

    protected TypeParametersToString(typeParameters: Contracts.ApiItemReference[]): string {
        const members = this.GetTypeParameters(typeParameters)
            .map(x => x.ToString())
            .join(", ");

        return `<${members}>`;
    }
}
