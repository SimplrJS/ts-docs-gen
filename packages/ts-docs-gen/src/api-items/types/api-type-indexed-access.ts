import { Contracts } from "ts-extractor";
import { ApiTypeBase } from "../api-type-base";
import { GeneratorHelpers } from "../../generator-helpers";
import { SerializedApiType, ReferenceRenderHandler } from "../../contracts/serialized-api-item";

/**
 * Example: `Foo[T]`
 */
export class ApiIndexedAccess extends ApiTypeBase<Contracts.IndexedAccessTypeDto> {
    private objectType: SerializedApiType | undefined;

    public get ObjectType(): SerializedApiType {
        if (this.objectType == null) {
            this.objectType = GeneratorHelpers.SerializeApiType(this.ExtractedData, this.ApiItem.ObjectType);
        }
        return this.objectType;
    }

    private indexType: SerializedApiType | undefined;

    public get IndexType(): SerializedApiType {
        if (this.indexType == null) {
            this.indexType = GeneratorHelpers.SerializeApiType(this.ExtractedData, this.ApiItem.IndexType);
        }
        return this.indexType;
    }

    public ToText(render: ReferenceRenderHandler = this.DefaultReferenceRenderer): string[] {
        const objectType: string = this.SerializedTypeToString(render, this.ObjectType);
        const indexType: string = this.SerializedTypeToString(render, this.IndexType);

        return [
            `${objectType}[${indexType}]`
        ];
    }
}
