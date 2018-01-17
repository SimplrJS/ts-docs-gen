import { Contracts, ExtractDto } from "ts-extractor";

import { GeneratorHelpers } from "../../generator-helpers";
import { SerializedApiType } from "../../contracts/serialized-api-item";
import { ApiDefinitionBase } from "../api-definition-base";

export class ApiParameter extends ApiDefinitionBase<Contracts.ApiParameterDto> {
    constructor(extractedData: ExtractDto, apiItem: Contracts.ApiParameterDto) {
        super(extractedData, apiItem);

        this.type = GeneratorHelpers.SerializeApiType(this.ExtractedData, this.Data.Type);
    }

    private type: SerializedApiType | undefined;

    public get Type(): SerializedApiType | undefined {
        return this.type;
    }

    public ToText(): string[] {
        const name = this.Data.Name;

        const initializerString = this.Data.Initializer ? ` = ${this.Data.Initializer}` : "";
        const isOptionalString = this.Data.IsOptional ? "?" : "";

        const type = this.SerializedTypeToString(this.Type);

        return [
            `${name}${isOptionalString}: ${type}${initializerString}`
        ];
    }

    public ToHeadingText(): string {
        return this.Data.Name;
    }
}
