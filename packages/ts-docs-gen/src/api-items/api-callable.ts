import { Contracts, ExtractDto } from "ts-extractor";

import { GeneratorHelpers } from "../generator-helpers";
import { ApiTypeParameter } from "./definitions/api-type-parameter";
import { ApiParameter } from "./definitions/api-parameter";
import { ApiDefinitionBase } from "./api-definition-base";
import { SerializedApiType } from "../contracts/serialized-api-item";
import { ApiItemReference } from "../contracts/api-item-reference";

/**
 * Base class for callable api items.
 */
export abstract class ApiCallable<TKind extends Contracts.ApiCallableDto> extends ApiDefinitionBase<TKind> {
    constructor(extractedData: ExtractDto, apiItem: TKind, reference: ApiItemReference) {
        super(extractedData, apiItem, reference);

        this.parameters = GeneratorHelpers
            .GetApiItemReferences(this.ExtractedData, this.Data.Parameters)
            .map(x => this.GetSerializedApiDefinition(x.Id))
            .filter((x): x is ApiParameter => x != null);

        this.typeParameters = this.GetTypeParameters();

        if (this.Data.ReturnType != null) {
            this.returnType = GeneratorHelpers.SerializeApiType(this.ExtractedData, this.Data.ReturnType);
        }
    }

    private parameters: ApiParameter[];

    public get Parameters(): ApiParameter[] {
        return this.parameters;
    }

    private typeParameters: ApiTypeParameter[];

    public get TypeParameters(): ApiTypeParameter[] {
        return this.typeParameters;
    }

    private returnType: SerializedApiType | undefined;

    public get ReturnType(): SerializedApiType | undefined {
        return this.returnType;
    }

    protected GetTypeParameters(): ApiTypeParameter[] {
        return super.GetTypeParameters(this.Data);
    }

    protected TypeParametersToString(): string {
        return super.TypeParametersToString(this.Data);
    }

    protected ParametersToString(): string {
        return this.parameters
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
