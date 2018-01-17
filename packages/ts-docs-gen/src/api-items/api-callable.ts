import { Contracts } from "ts-extractor";

import { GeneratorHelpers } from "../generator-helpers";
import { ApiTypeParameter } from "./definitions/api-type-parameter";
import { ApiParameter } from "./definitions/api-parameter";
import { ApiDefinitionBase } from "./api-definition-base";

/**
 * Base class for callable api items.
 */
export abstract class ApiCallable<TKind extends Contracts.ApiCallableDto> extends ApiDefinitionBase<TKind> {
    protected GetTypeParameters(): ApiTypeParameter[] {
        return super.GetTypeParameters(this.Data);
    }

    protected TypeParametersToString(): string {
        return super.TypeParametersToString(this.Data);
    }

    protected GetParameters(): ApiParameter[] {
        return GeneratorHelpers
            .GetApiItemsFromReference<Contracts.ApiParameterDto>(this.ExtractedData, this.Data.Parameters)
            .map(x => new ApiParameter(this.ExtractedData, x));
    }

    protected ParametersToString(): string {
        return this.GetParameters()
            .map(x => x.ToText())
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
