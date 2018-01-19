import { Contracts } from "ts-extractor";

import { ApiDefinitionWithType } from "../api-definition-with-type";
import { ApiTypeParameter } from "./api-type-parameter";
import { GeneratorHelpers } from "../../generator-helpers";

export class ApiTypeAlias extends ApiDefinitionWithType<Contracts.ApiTypeAliasDto> {
    private typeParameters: ApiTypeParameter[];

    public get TypeParameters(): ApiTypeParameter[] {
        if (this.typeParameters == null) {
            this.typeParameters = GeneratorHelpers
                .GetApiItemReferences(this.ExtractedData, this.ApiItem.TypeParameters)
                .map(x => this.GetSerializedApiDefinition(x) as ApiTypeParameter);
        }
        return this.typeParameters;
    }

    public ToText(): string[] {
        const name = this.Reference.Alias || this.Name;
        const type = this.Type.ToText().join("\n");
        const typeParameters = this.TypeParametersToString(this.TypeParameters);

        return [
            `type ${name}${typeParameters} = ${type};`
        ];
    }

    public ToHeadingText(): string {
        return this.Reference.Alias || this.Name;
    }
}
