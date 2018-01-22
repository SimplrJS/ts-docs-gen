import { Contracts } from "ts-extractor";
import { ApiTypeReferenceBase } from "../api-type-reference-base";
import { ReferenceRenderHandler } from "../../contracts/serialized-api-item";
import { Logger } from "../../utils/logger";

/**
 * Example: `typeof Foo`
 */
export class ApiTypeQuery extends ApiTypeReferenceBase<Contracts.TypeQueryType> {
    public ToText(render: ReferenceRenderHandler = this.DefaultReferenceRenderer): string[] {
        let name: string;
        if (this.ReferenceItem != null) {
            name = this.ReferenceItem.Name;
        } else {
            // TODO: Upgrade ts-extractor, so we could add informative warning.
            Logger.Warn("Missing reference!");
            name = "???";
        }

        return [
            `${this.ApiItem.Keyword} ${name}`
        ];
    }
}
