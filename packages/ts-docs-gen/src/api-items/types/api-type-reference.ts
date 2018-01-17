import { Contracts, ExtractDto } from "ts-extractor";
import { ApiTypeReferenceBase } from "../api-type-reference-base";
import { SerializedApiType } from "../../contracts/serialized-api-item";

export class ApiTypeReference extends ApiTypeReferenceBase<Contracts.ApiReferenceType> {
    constructor(extractedData: ExtractDto, apiItem: Contracts.ApiReferenceType) {
        super(extractedData, apiItem);

        this.typeParameters = this.GetTypeParameters(this.Data.TypeParameters);
    }

    private typeParameters: SerializedApiType[] | undefined;

    public get TypeParameters(): SerializedApiType[] | undefined {
        return this.typeParameters;
    }

    public ToText(): string[] {
        const typeParameters = this.TypeParametersToString(this.typeParameters);

        return [
            `${this.Data.SymbolName}${typeParameters}`
        ];
    }
}
