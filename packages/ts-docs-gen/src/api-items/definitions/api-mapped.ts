import { Contracts, ExtractDto } from "ts-extractor";

import { GeneratorHelpers } from "../../generator-helpers";
import { ApiTypeParameter } from "./api-type-parameter";
import { SerializedApiType } from "../../contracts/serialized-api-item";
import { ApiDefinitionBase } from "../api-definition-base";

export class ApiMapped extends ApiDefinitionBase<Contracts.ApiMappedDto> {
    constructor(extractedData: ExtractDto, apiItem: Contracts.ApiMappedDto) {
        super(extractedData, apiItem);

        this.type = GeneratorHelpers.SerializeApiType(this.ExtractedData, this.Data.Type);
        this.typeParameter = this.getTypeParameter();
    }

    private type: SerializedApiType<Contracts.ApiType> | undefined;

    public get Type(): SerializedApiType<Contracts.ApiType> | undefined {
        return this.type;
    }

    private typeParameter: ApiTypeParameter | undefined;

    public get TypeParameter(): ApiTypeParameter | undefined {
        return this.typeParameter;
    }

    private getTypeParameter(): ApiTypeParameter | undefined {
        if (this.Data.TypeParameter == null) {
            return undefined;
        }

        const apiItem = this.ExtractedData.Registry[this.Data.TypeParameter] as Contracts.ApiTypeParameterDto;
        return new ApiTypeParameter(this.ExtractedData, apiItem);
    }

    public ToText(): string[] {
        const readonly = this.Data.IsReadonly ? "readonly " : "";
        const optional = this.Data.IsOptional ? "?" : "";

        let typeParameterString: string;
        if (this.TypeParameter != null) {
            typeParameterString = this.TypeParameter.ToText().join(" ");
        } else {
            // TODO: Add logger for missing TypeParameter.
            typeParameterString = "???";
        }

        const type = this.SerializedTypeToString(this.Type);

        return [`{${readonly}[${typeParameterString}]${optional}: ${type}}`];
    }

    public ToHeadingText(): string {
        return this.Data.Name;
    }
}
