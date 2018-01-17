import { Contracts, ExtractDto } from "ts-extractor";

import { GeneratorHelpers } from "../../generator-helpers";
import { ApiDefinitionBase } from "../api-definition-base";
import { SerializedApiType } from "../../contracts/serialized-api-item";

export class ApiVariable extends ApiDefinitionBase<Contracts.ApiVariableDto> {
    constructor(extractedData: ExtractDto, apiItem: Contracts.ApiVariableDto) {
        super(extractedData, apiItem);

        this.type = GeneratorHelpers.SerializeApiType(this.ExtractedData, this.Data.Type);
    }

    private type: SerializedApiType | undefined;

    public get Type(): SerializedApiType | undefined {
        return this.type;
    }

    public ToText(alias?: string): string[] {
        const name = alias || this.Data.Name;
        const type = this.SerializedTypeToString(this.Type);

        return [
            `${this.Data.VariableDeclarationType} ${name}: ${type};`
        ];
    }

    public ToHeadingText(alias?: string): string {
        return alias || this.Data.Name;
    }
}
