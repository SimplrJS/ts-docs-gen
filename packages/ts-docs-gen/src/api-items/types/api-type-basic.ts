import { Contracts } from "ts-extractor";
import { ApiTypeBase } from "../api-type-base";
import { ReferenceRenderHandler } from "../../contracts/serialized-api-item";

/**
 * Example: `string`
 */
export class ApiTypeBasic extends ApiTypeBase<Contracts.ApiBasicType> {
    public ToText(render: ReferenceRenderHandler = this.DefaultReferenceRenderer): string[] {
        return [
            this.ApiItem.Text
        ];
    }
}
