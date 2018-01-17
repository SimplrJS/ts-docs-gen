import { Contracts, ExtractDto } from "ts-extractor";
import { ApiTypeBase } from "../api-type-base";
import { GeneratorHelpers } from "../../generator-helpers";
import { SerializedApiType } from "../../contracts/serialized-api-item";

/**
 * Example: `Foo[]`
 */
export class ApiTypeArray extends ApiTypeBase<Contracts.ArrayType> {
    constructor(extractedData: ExtractDto, apiItem: Contracts.ArrayType) {
        super(extractedData, apiItem);

        this.type = GeneratorHelpers.SerializeApiType(this.ExtractedData, this.Data.Type);
    }

    private type: SerializedApiType | undefined;

    public get Type(): SerializedApiType | undefined {
        return this.type;
    }

    public ToText(): string[] {
        let type: string;
        if (this.Type != null) {
            type = this.Type.ToText().join(" ");
        } else {
            type = "???";
        }

        return [
            `${type}[]`
        ];
    }
}
