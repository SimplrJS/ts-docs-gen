import { Contracts, ExtractDto } from "ts-extractor";
import { ApiTypeBase } from "../api-type-base";
import { GeneratorHelpers } from "../../generator-helpers";
import { SerializedApiType } from "../../contracts/serialized-api-item";

/**
 * Example: `Foo | Bar` or `Foo & Bar`.
 */
export class ApiTypeUnionOrIntersection extends ApiTypeBase<Contracts.ApiUnionOrIntersectionType> {
    constructor(extractedData: ExtractDto, apiItem: Contracts.ApiUnionOrIntersectionType) {
        super(extractedData, apiItem);

        this.members = this.Data.Members
            .map(x => GeneratorHelpers.SerializeApiType(this.ExtractedData, x))
            .filter((x): x is SerializedApiType => x != null);
    }

    private members: SerializedApiType[];

    public get Members(): SerializedApiType[] {
        return this.members;
    }

    public ToText(): string[] {
        const character = this.Data.ApiTypeKind === Contracts.ApiTypeKind.Union ? "|" : "&";

        return [
            this.Members.join(` ${character} `)
        ];
    }
}
