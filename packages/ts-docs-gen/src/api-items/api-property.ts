import { Contracts } from "ts-extractor";

import { BaseApiItem } from "../abstractions/base-api-item";
import { GeneratorHelpers } from "../generator-helpers";

export class ApiProperty extends BaseApiItem<Contracts.ApiPropertyDto> {
    public ToText(): string[] {
        const optional = this.Data.IsOptional ? "?" : "";
        const readOnly = this.Data.IsReadonly ? "readonly " : "";
        const type = GeneratorHelpers.ApiTypeToString(this.ExtractedData, this.Data.Type);

        return [`${readOnly}${this.Data.Name}${optional}: ${type};`];
    }

    public ToHeadingText(): string {
        return this.Data.Name;
    }
}
