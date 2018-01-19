import { Contracts } from "ts-extractor";
import { ApiTypeReferenceBase } from "../api-type-reference-base";

/**
 * Example: `typeof Foo`
 */
export class ApiTypeQuery extends ApiTypeReferenceBase<Contracts.TypeQueryType> {
    public ToText(): string[] {
        let name: string;
        if (this.ReferenceItem != null) {
            name = this.ReferenceItem.Name;
        } else {
            // TODO: Add Log for missing reference.
            name = "???";
        }

        return [
            `${this.ApiItem.Keyword} ${name}`
        ];
    }
}
