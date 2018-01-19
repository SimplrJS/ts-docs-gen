import { Contracts } from "ts-extractor";

import { ApiTypeParameter } from "./api-type-parameter";
import { ApiDefinitionWithType } from "../api-definition-with-type";
import { GeneratorHelpers } from "../../generator-helpers";

export class ApiMapped extends ApiDefinitionWithType<Contracts.ApiMappedDto> {
    private typeParameter: ApiTypeParameter | undefined;

    public get TypeParameter(): ApiTypeParameter | undefined {
        if (this.typeParameter == null && this.ApiItem.TypeParameter != null) {
            const apiItem = this.ExtractedData.Registry[this.ApiItem.TypeParameter] as Contracts.ApiTypeParameterDto;
            this.typeParameter = new ApiTypeParameter(this.ExtractedData, apiItem, { Alias: apiItem.Name, Id: this.ApiItem.TypeParameter });
        }
        return this.typeParameter;
    }

    public ToText(): string[] {
        const readonly = this.ApiItem.IsReadonly ? "readonly " : "";
        const optional = this.ApiItem.IsOptional ? "?" : "";

        let typeParameterString: string;
        if (this.TypeParameter != null) {
            typeParameterString = this.TypeParameter.ToInlineText();
        } else {
            // TODO: Add logger for missing TypeParameter.
            typeParameterString = "???";
        }

        const type = this.SerializedTypeToString(this.Type);

        return [
            `{`,
            `${GeneratorHelpers.Tab(1)}${readonly}[${typeParameterString}]${optional}: ${type}`,
            `}`
        ];
    }

    public ToHeadingText(): string {
        return this.Reference.Alias || this.Name;
    }
}
