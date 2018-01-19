import { Contracts } from "ts-extractor";

import { ApiDefinitionWithType } from "../api-definition-with-type";

export class ApiProperty extends ApiDefinitionWithType<Contracts.ApiPropertyDto> {
    public ToText(): string[] {
        const optional = this.ApiItem.IsOptional ? "?" : "";
        const readOnly = this.ApiItem.IsReadonly ? "readonly " : "";
        const type = this.SerializedTypeToString(this.Type);

        return [`${readOnly}${this.Name}${optional}: ${type};`];
    }

    public ToHeadingText(): string {
        return this.Name;
    }
}
