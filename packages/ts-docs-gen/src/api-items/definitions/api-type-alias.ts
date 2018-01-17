import { Contracts } from "ts-extractor";

import { ApiDefinitionWithType } from "../api-definition-with-type";

export class ApiTypeAlias extends ApiDefinitionWithType<Contracts.ApiTypeAliasDto> {
    public ToText(): string[] {
        const name = this.Reference.Alias || this.Data.Name;
        const typeParameters = this.GetTypeParameters(this.Data);
        const type = this.SerializedTypeToString(this.Type);

        return [
            `type ${name}${typeParameters} = ${type}`
        ];
    }

    public ToHeadingText(): string {
        return this.Reference.Alias || this.Data.Name;
    }
}
