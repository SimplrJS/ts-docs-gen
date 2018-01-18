import { Contracts, ExtractDto } from "ts-extractor";
import { ApiTypeBase } from "../api-type-base";
import { GeneratorHelpers } from "../../generator-helpers";
import { ApiTypes } from "../api-type-list";

/**
 * Example: `keyof Foo`
 */
export class ApiTypeOperator extends ApiTypeBase<Contracts.TypeOperatorType> {
    constructor(extractedData: ExtractDto, apiItem: Contracts.TypeOperatorType) {
        super(extractedData, apiItem);

        this.type = GeneratorHelpers.SerializeApiType(this.ExtractedData, this.Data.Type);
    }

    private type: ApiTypes | undefined;

    public get Type(): ApiTypes | undefined {
        return this.type;
    }

    public ToText(): string[] {
        const type: string = this.SerializedTypeToString(this.Type);
        return [
            `${this.Data.Keyword} ${type}`
        ];
    }
}
