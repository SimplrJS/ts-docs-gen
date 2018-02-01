import { Contracts } from "ts-extractor";

import { ApiDefinitionWithType } from "../api-definition-with-type";
import { ApiTypeParameter } from "./api-type-parameter";
import { GeneratorHelpers } from "../../generator-helpers";
import { ReferenceRenderHandler } from "../../contracts/serialized-api-item";

export class ApiTypeAlias extends ApiDefinitionWithType<Contracts.ApiTypeAliasDto> {
    private typeParameters: ApiTypeParameter[] | undefined;

    public get TypeParameters(): ApiTypeParameter[] {
        if (this.typeParameters == null) {
            this.typeParameters = GeneratorHelpers
                .GetApiItemReferences(this.ExtractedData, this.ApiItem.TypeParameters)
                .map(x => this.GetSerializedApiDefinition(x) as ApiTypeParameter);
        }
        return this.typeParameters;
    }

    public ToText(render: ReferenceRenderHandler = this.DefaultReferenceRenderer): string[] {
        const type = this.Type.ToText().join("\n");
        const typeParameters = this.TypeParametersToString(render, this.TypeParameters);

        return [
            `type ${this.Name}${typeParameters} = ${type};`
        ];
    }

    public ToHeadingText(): string {
        return this.Name;
    }
}
