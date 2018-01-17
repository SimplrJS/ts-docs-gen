import { Contracts } from "ts-extractor";

import { ApiDefinitionWithType } from "../api-definition-with-type";

export class ApiParameter extends ApiDefinitionWithType<Contracts.ApiParameterDto> {
    public ToText(): string[] {
        const name = this.Reference.Alias || this.Data.Name;

        const initializerString = this.Data.Initializer ? ` = ${this.Data.Initializer}` : "";
        const isOptionalString = this.Data.IsOptional ? "?" : "";

        const type = this.SerializedTypeToString(this.Type);

        return [
            `${name}${isOptionalString}: ${type}${initializerString}`
        ];
    }

    public ToHeadingText(): string {
        return this.Reference.Alias || this.Data.Name;
    }
}
