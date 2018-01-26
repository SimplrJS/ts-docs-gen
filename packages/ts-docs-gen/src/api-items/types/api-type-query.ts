import { Contracts } from "ts-extractor";
import { LogLevel } from "simplr-logger";
import { ApiTypeReferenceBase } from "../api-type-reference-base";
import { ReferenceRenderHandler } from "../../contracts/serialized-api-item";
import { GeneratorHelpers } from "../../generator-helpers";

/**
 * Example: `typeof Foo`
 */
export class ApiTypeQuery extends ApiTypeReferenceBase<Contracts.TypeQueryTypeDto> {
    public ToText(render: ReferenceRenderHandler = this.DefaultReferenceRenderer): string[] {
        let name: string;
        if (this.ReferenceItem != null) {
            name = this.ReferenceItem.Name;
        } else {
            GeneratorHelpers.LogWithApiItemPosition(LogLevel.Error, this.ApiItem, "Missing reference!");
            name = "???";
        }

        return [
            `${this.ApiItem.Keyword} ${name}`
        ];
    }
}
