import { Contracts } from "ts-extractor";
import { ApiTypeBase } from "../api-type-base";
import { GeneratorHelpers } from "../../generator-helpers";
import { ApiTypes } from "../api-type-list";

/**
 * Example: `arg is string`
 */
export class ApiTypePredicate extends ApiTypeBase<Contracts.TypePredicateType> {
    private type: ApiTypes;

    public get Type(): ApiTypes {
        if (this.type == null) {
            this.type = GeneratorHelpers.SerializeApiType(this.ExtractedData, this.ApiItem.Type);
        }
        return this.type;
    }

    public ToText(): string[] {
        const type: string = this.SerializedTypeToString(this.Type);

        return [
            `${this.ApiItem.ParameterName} is ${type}`
        ];
    }
}
