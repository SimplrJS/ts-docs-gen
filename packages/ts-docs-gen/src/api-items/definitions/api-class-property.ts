import { Contracts, ExtractDto } from "ts-extractor";
import { GeneratorHelpers } from "../../generator-helpers";
import { ApiDefinitionBase } from "../api-definition-base";
import { SerializedApiType } from "../../contracts/serialized-api-item";

export class ApiClassProperty extends ApiDefinitionBase<Contracts.ApiClassPropertyDto> {
    constructor(extractedData: ExtractDto, apiItem: Contracts.ApiClassPropertyDto) {
        super(extractedData, apiItem);

        this.type = GeneratorHelpers.SerializeApiType(this.ExtractedData, this.Data.Type);
    }

    private type: SerializedApiType | undefined;

    public get Type(): SerializedApiType | undefined {
        return this.type;
    }

    public ToText(alias?: string | undefined): string[] {
        const name = alias || this.Data.Name;

        const optional = this.Data.IsOptional ? "?" : "";
        const readOnly = this.Data.IsReadonly ? " readonly" : "";
        const abstract = this.Data.IsAbstract ? " abstract" : "";
        const $static = this.Data.IsStatic ? " static" : "";

        const access = this.Data.AccessModifier;
        const type = this.SerializedTypeToString(this.Type);

        return [`${access}${$static}${abstract}${readOnly} ${name}${optional}: ${type};`];
    }

    public ToHeadingText(alias?: string | undefined): string {
        return alias || this.Data.Name;
    }
}
