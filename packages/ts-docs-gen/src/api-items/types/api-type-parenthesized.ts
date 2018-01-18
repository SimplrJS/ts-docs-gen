import { Contracts, ExtractDto } from "ts-extractor";
import { ApiTypeBase } from "../api-type-base";
import { GeneratorHelpers } from "../../generator-helpers";
import { ApiTypes } from "../api-type-list";

/**
 * Example: `(string | number)`
 */
export class ApiTypeParenthesized extends ApiTypeBase<Contracts.ParenthesizedType> {
    constructor(extractedData: ExtractDto, apiItem: Contracts.ParenthesizedType) {
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
            `(${type})`
        ];
    }
}
