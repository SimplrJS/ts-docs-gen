import { Contracts } from "ts-extractor";

import { GeneratorHelpers } from "../generator-helpers";
import { ApiTypeParameter } from "./definitions/api-type-parameter";
import { ApiParameter } from "./definitions/api-parameter";
import { ApiDefinitionBase } from "./api-definition-base";
import { ApiTypes } from "./api-type-list";

/**
 * Base class for callable api items.
 */
export abstract class ApiCallable<TKind extends Contracts.ApiCallableDto> extends ApiDefinitionBase<TKind> {
    private parameters: ApiParameter[];

    public get Parameters(): ApiParameter[] {
        if (this.parameters == null) {
            this.parameters = GeneratorHelpers
                .GetApiItemReferences(this.ExtractedData, this.Data.Parameters)
                .map(x => this.GetSerializedApiDefinition(x))
                .filter((x): x is ApiParameter => x != null);
        }
        return this.parameters;
    }

    private typeParameters: ApiTypeParameter[];

    public get TypeParameters(): ApiTypeParameter[] {
        if (this.typeParameters == null) {
            this.typeParameters = GeneratorHelpers
                .GetApiItemReferences(this.ExtractedData, this.Data.TypeParameters)
                .map(x => this.GetSerializedApiDefinition(x) as ApiTypeParameter);
        }

        return this.typeParameters;
    }

    private returnType: ApiTypes | undefined;

    public get ReturnType(): ApiTypes | undefined {
        if (this.returnType == null && this.Data.ReturnType != null) {
            return GeneratorHelpers.SerializeApiType(this.ExtractedData, this.Data.ReturnType);
        }

        return this.returnType;
    }

    protected TypeParametersToString(): string {
        return super.TypeParametersToString(this.TypeParameters);
    }

    protected ParametersToString(): string {
        return this.Parameters
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
        const type = this.SerializedTypeToString(this.ReturnType);
        const returnTypeString = typeDefChar != null && type != null ? `${typeDefChar}${type}` : "";

        return `${typeParametersString}(${parametersString})${returnTypeString}`;
    }
}
