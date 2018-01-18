import { Contracts } from "ts-extractor";

import { ApiTypeParameter } from "./api-type-parameter";
import { ApiDefinitionWithType } from "../api-definition-with-type";

export class ApiMapped extends ApiDefinitionWithType<Contracts.ApiMappedDto> {
    private typeParameter: ApiTypeParameter | undefined;

    public get TypeParameter(): ApiTypeParameter | undefined {
        if (this.typeParameter == null && this.Data.TypeParameter != null) {
            const apiItem = this.ExtractedData.Registry[this.Data.TypeParameter] as Contracts.ApiTypeParameterDto;
            this.typeParameter = new ApiTypeParameter(this.ExtractedData, apiItem, { Alias: "", Id: this.Data.TypeParameter });
        }
        return this.typeParameter;
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
        return this.Reference.Alias || this.Data.Name;
    }
}
