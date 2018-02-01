import { Contracts } from "ts-extractor";
import { ApiTypeBase } from "../api-type-base";
import { GeneratorHelpers } from "../../generator-helpers";
import { ApiTypes } from "../api-type-list";
import { ReferenceRenderHandler } from "../../contracts/serialized-api-item";

/**
 * Example: `(string | number)`
 */
export class ApiTypeParenthesized extends ApiTypeBase<Contracts.ParenthesizedTypeDto> {
    private type: ApiTypes | undefined;

    public get Type(): ApiTypes {
        if (this.type == null) {
            this.type = GeneratorHelpers.SerializeApiType(this.ExtractedData, this.ApiItem.Type);
        }
        return this.type;
    }

    public ToText(render: ReferenceRenderHandler = this.DefaultReferenceRenderer): string[] {
        const type: string = this.SerializedTypeToString(render, this.Type);

        return [
            `(${type})`
        ];
    }
}
