import { Contracts, ExtractDto } from "ts-extractor";

import { ApiDefinitionWithType } from "../api-definition-with-type";
import { ApiItemReference } from "../../contracts/api-item-reference";
import { ApiTypeParameter } from "./api-type-parameter";
import { GeneratorHelpers } from "../../generator-helpers";

export class ApiTypeAlias extends ApiDefinitionWithType<Contracts.ApiTypeAliasDto> {
    constructor(extractedData: ExtractDto, apiItem: Contracts.ApiTypeAliasDto, reference: ApiItemReference) {
        super(extractedData, apiItem, reference);

        this.typeParameters = GeneratorHelpers
            .GetApiItemReferences(this.ExtractedData, apiItem.TypeParameters)
            .map(x => this.GetSerializedApiDefinition(x) as ApiTypeParameter);
    }

    private typeParameters: ApiTypeParameter[];

    public get TypeParameters(): ApiTypeParameter[] {
        return this.typeParameters;
    }

    public ToText(): string[] {
        const name = this.Reference.Alias || this.Data.Name;
        const type = this.SerializedTypeToString(this.Type);
        const typeParameters = this.TypeParametersToString(this.TypeParameters);

        return [
            `type ${name}${typeParameters} = ${type}`
        ];
    }

    public ToHeadingText(): string {
        return this.Reference.Alias || this.Data.Name;
    }
}
