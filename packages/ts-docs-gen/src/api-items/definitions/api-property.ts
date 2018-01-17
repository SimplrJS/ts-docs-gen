import { Contracts } from "ts-extractor";

import { ApiDefinitionWithType } from "../api-definition-with-type";

export class ApiProperty extends ApiDefinitionWithType<Contracts.ApiPropertyDto> {
    public ToText(): string[] {
        const optional = this.Data.IsOptional ? "?" : "";
        const readOnly = this.Data.IsReadonly ? "readonly " : "";
        const type = this.SerializedTypeToString(this.Type);

        return [`${readOnly}${this.Data.Name}${optional}: ${type};`];
    }

    public ToHeadingText(): string {
        return this.Reference.Alias || this.Data.Name;
    }
}
