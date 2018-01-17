import { Contracts, ExtractDto } from "ts-extractor";
import { ApiTypeBase } from "../api-type-base";
import { GeneratorHelpers } from "../../generator-helpers";
import { SerializedApiType } from "../../contracts/serialized-api-item";

/**
 * Example: `Foo[T]`
 */
export class ApiIndexedAccess extends ApiTypeBase<Contracts.IndexedAccessType> {
    constructor(extractedData: ExtractDto, apiItem: Contracts.IndexedAccessType) {
        super(extractedData, apiItem);

        this.objectType = GeneratorHelpers.SerializeApiType(this.ExtractedData, this.Data.ObjectType);
        this.indexType = GeneratorHelpers.SerializeApiType(this.ExtractedData, this.Data.IndexType);
    }

    private objectType: SerializedApiType | undefined;
    private indexType: SerializedApiType | undefined;

    public get ObjectType(): SerializedApiType | undefined {
        return this.objectType;
    }

    public get IndexType(): SerializedApiType | undefined {
        return this.indexType;
    }

    public ToText(): string[] {
        const objectType: string = this.SerializedTypeToString(this.ObjectType);
        const indexType: string = this.SerializedTypeToString(this.IndexType);

        return [
            `${objectType}[${indexType}]`
        ];
    }
}
