import { Contracts, ExtractDto } from "ts-extractor";
import { ApiTypeReferenceBase } from "../api-type-reference-base";
import { SerializedApiType } from "../../contracts/serialized-api-item";

/**
 * Example: `Foo` or `Foo<string>`.
 */
export class ApiTypeReference extends ApiTypeReferenceBase<Contracts.ApiReferenceType> {
    constructor(extractedData: ExtractDto, apiItem: Contracts.ApiReferenceType) {
        super(extractedData, apiItem);

        this.typeParameters = this.GetTypeParameters(this.Data.TypeParameters);
    }

    private typeParameters: ApiTypes[] | undefined;

    public get TypeParameters(): ApiTypes[] | undefined {
        return this.typeParameters;
    }

    public ToText(): string[] {
        const typeParameters = this.TypeParametersToString(this.typeParameters);

        return [
            `${this.Data.SymbolName}${typeParameters}`
        ];
    }
}
