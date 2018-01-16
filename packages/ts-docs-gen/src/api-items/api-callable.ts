import { Contracts } from "ts-extractor";

import { BaseApiItem } from "../abstractions/base-api-item";
import { GeneratorHelpers } from "../generator-helpers";
import { ApiTypeParameter } from "./api-type-parameter";
import { ApiParameter } from "./api-parameter";

export abstract class ApiCallable<TKind extends Contracts.ApiCallableDto> extends BaseApiItem<TKind> {
    protected GetTypeParameters(): ApiTypeParameter[] {
        return GeneratorHelpers
            .GetApiItemsFromReference<Contracts.ApiTypeParameterDto>(this.ExtractedData, this.Data.TypeParameters)
            .map(x => new ApiTypeParameter(this.ExtractedData, x));
    }

    protected TypeParametersToString(): string {
        const members = this.GetTypeParameters()
            .map(x => x.ToString())
            .join(", ");

        return `<${members}>`;
    }

    protected GetParameters(): ApiParameter[] {
        return GeneratorHelpers
            .GetApiItemsFromReference<Contracts.ApiParameterDto>(this.ExtractedData, this.Data.Parameters)
            .map(x => new ApiParameter(this.ExtractedData, x));
    }

    protected ParametersToString(): string {
        return this.GetTypeParameters()
            .map(x => x.ToString())
            .join(", ");
    }

    /**
     * Example: `<TValue>(arg: TValue): void`
     * @param typeDefChar If undefined, return type is not shown. @default ": "
     */
    protected CallableToString(typeDefChar: string = ": "): string {
        // TypeParameters
        const typeParametersString = this.TypeParametersToString();

        // Parameters
        const parametersString = this.ParametersToString();

        // ReturnType
        const type = GeneratorHelpers.ApiTypeToString(this.ExtractedData, this.Data.ReturnType);
        const returnTypeString = typeDefChar != null ? `${typeDefChar}${type}` : "";

        return `${typeParametersString}(${parametersString})${returnTypeString}`;
    }
}
