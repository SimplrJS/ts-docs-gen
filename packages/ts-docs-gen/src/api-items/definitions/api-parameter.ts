import { Contracts } from "ts-extractor";

import { BaseApiItemClass } from "../../abstractions/base-api-item";
import { GeneratorHelpers } from "../../generator-helpers";

export class ApiParameter extends BaseApiItemClass<Contracts.ApiParameterDto> {
    public ToText(): string[] {
        const name = this.Data.Name;

        const initializerString = this.Data.Initializer ? ` = ${this.Data.Initializer}` : "";
        const isOptionalString = this.Data.IsOptional ? "?" : "";

        const type = GeneratorHelpers.ApiTypeToString(this.ExtractedData, this.Data.Type);

        return [
            `${name}${isOptionalString}: ${type}${initializerString}`
        ];
    }

    public ToHeadingText(): string {
        return this.Data.Name;
    }
}
