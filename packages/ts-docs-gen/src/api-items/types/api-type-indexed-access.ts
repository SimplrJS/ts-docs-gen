import { Contracts } from "ts-extractor";
import { ApiTypeBase } from "../api-type-base";
import { GeneratorHelpers } from "../../generator-helpers";
import { SerializedApiType } from "../../contracts/serialized-api-item";

/**
 * Example: `Foo[T]`
 */
export class ApiIndexedAccess extends ApiTypeBase<Contracts.IndexedAccessType> {
    private objectType: SerializedApiType;

    public get ObjectType(): SerializedApiType {
        if (this.objectType == null) {
            this.objectType = GeneratorHelpers.SerializeApiType(this.ExtractedData, this.ApiItem.ObjectType);
        }
        return this.objectType;
    }

    private indexType: SerializedApiType;

    public get IndexType(): SerializedApiType {
        if (this.indexType == null) {
            this.indexType = GeneratorHelpers.SerializeApiType(this.ExtractedData, this.ApiItem.IndexType);
        }
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
