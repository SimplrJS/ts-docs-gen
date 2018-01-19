import { Contracts } from "ts-extractor";
import { ApiTypeBase } from "../api-type-base";

/**
 * Example: `string`
 */
export class ApiTypeBasic extends ApiTypeBase<Contracts.ApiBasicType> {
    public ToText(): string[] {
        return [
            this.ApiItem.Text
        ];
    }
}
