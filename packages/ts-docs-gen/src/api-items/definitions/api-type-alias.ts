import { Contracts, ExtractDto } from "ts-extractor";

import { GeneratorHelpers } from "../../generator-helpers";
import { ApiDefinitionBase } from "../api-definition-base";
import { SerializedApiType } from "../../contracts/serialized-api-item";

export class ApiTypeAlias extends ApiDefinitionBase<Contracts.ApiTypeAliasDto> {
    constructor(extractedData: ExtractDto, apiItem: Contracts.ApiTypeAliasDto) {
        super(extractedData, apiItem);

        this.type = GeneratorHelpers.SerializeApiType(this.ExtractedData, this.Data.Type);
    }

    private type: SerializedApiType | undefined;

    public get Type(): SerializedApiType | undefined {
        return this.type;
    }

    public ToText(alias?: string): string[] {
        const name = alias || this.Data.Name;
        const typeParameters = this.GetTypeParameters(this.Data);
        const type = this.SerializedTypeToString(this.Type);

        return [
            `type ${name}${typeParameters} = ${type}`
        ];
    }

    public ToHeadingText(): string {
        return this.Data.Name;
    }
}
