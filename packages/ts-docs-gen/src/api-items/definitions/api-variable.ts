import { Contracts } from "ts-extractor";

import { ApiDefinitionWithType } from "../api-definition-with-type";

export class ApiVariable extends ApiDefinitionWithType<Contracts.ApiVariableDto> {
    public ToText(): string[] {
        const name = this.Reference.Alias || this.Data.Name;
        const type = this.SerializedTypeToString(this.Type);

        return [
            `${this.Data.VariableDeclarationType} ${name}: ${type};`
        ];
    }

    public ToHeadingText(): string {
        return this.Reference.Alias || this.Data.Name;
    }
}
