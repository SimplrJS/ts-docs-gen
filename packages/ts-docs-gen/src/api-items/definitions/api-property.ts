import { Contracts, ExtractDto } from "ts-extractor";

import { GeneratorHelpers } from "../../generator-helpers";
import { SerializedApiType } from "../../contracts/serialized-api-item";
import { ApiDefinitionBase } from "../api-definition-base";

export class ApiProperty extends ApiDefinitionBase<Contracts.ApiPropertyDto> {
    constructor(extractedData: ExtractDto, apiItem: Contracts.ApiPropertyDto) {
        super(extractedData, apiItem);

        this.type = GeneratorHelpers.SerializeApiType(this.ExtractedData, this.Data.Type);
    }

    private type: SerializedApiType | undefined;

    public get Type(): SerializedApiType | undefined {
        return this.type;
    }

    public ToText(): string[] {
        const optional = this.Data.IsOptional ? "?" : "";
        const readOnly = this.Data.IsReadonly ? "readonly " : "";
        const type = this.SerializedTypeToString(this.Type);

        return [`${readOnly}${this.Data.Name}${optional}: ${type};`];
    }

    public ToHeadingText(): string {
        return this.Data.Name;
    }
}
