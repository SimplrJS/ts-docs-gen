import { Contracts, ExtractDto } from "ts-extractor";
import { ApiTypeBase } from "../api-type-base";
import { GeneratorHelpers } from "../../generator-helpers";
import { SerializedApiType } from "../../contracts/serialized-api-item";

/**
 * Example: `arg is string`
 */
export class ApiTypePredicate extends ApiTypeBase<Contracts.TypePredicateType> {
    constructor(extractedData: ExtractDto, apiItem: Contracts.TypePredicateType) {
        super(extractedData, apiItem);

        this.type = GeneratorHelpers.SerializeApiType(this.ExtractedData, this.Data.Type);
    }

    private type: SerializedApiType | undefined;

    public get Type(): SerializedApiType | undefined {
        return this.type;
    }

    public ToText(): string[] {
        const type: string = this.SerializedTypeToString(this.Type);

        return [
            `${this.Data.ParameterName} is ${type}`
        ];
    }
}
