import { Contracts } from "ts-extractor";

import { ApiDefinitionWithType } from "../api-definition-with-type";

export class ApiParameter extends ApiDefinitionWithType<Contracts.ApiParameterDto> {
    public ToText(): string[] {
        const name = this.Reference.Alias || this.Name;

        const initializerString = this.ApiItem.Initializer ? ` = ${this.ApiItem.Initializer}` : "";
        const isOptionalString = this.ApiItem.IsOptional ? "?" : "";

        const type = this.SerializedTypeToString(this.Type);

        return [
            `${name}${isOptionalString}: ${type}${initializerString}`
        ];
    }

    public ToHeadingText(): string {
        return this.Reference.Alias || this.Name;
    }
}
