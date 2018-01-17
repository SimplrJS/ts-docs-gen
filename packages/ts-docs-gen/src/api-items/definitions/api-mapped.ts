import { Contracts } from "ts-extractor";

import { BaseApiItemClass } from "../../abstractions/base-api-item";
import { GeneratorHelpers } from "../../generator-helpers";
import { ApiTypeParameter } from "./api-type-parameter";

export class ApiMapped extends BaseApiItemClass<Contracts.ApiMappedDto> {
    protected GetTypeParameter(): ApiTypeParameter | undefined {
        if (this.Data.TypeParameter == null) {
            return undefined;
        }

        const apiItem = this.ExtractedData.Registry[this.Data.TypeParameter] as Contracts.ApiTypeParameterDto;
        return new ApiTypeParameter(this.ExtractedData, apiItem);
    }

    public ToText(): string[] {
        const readonly = this.Data.IsReadonly ? "readonly " : "";
        const optional = this.Data.IsOptional ? "?" : "";

        const typeParameter = this.GetTypeParameter();
        let typeParameterString: string;
        if (typeParameter != null) {
            typeParameterString = typeParameter.ToText().join("\n");
        } else {
            // TODO: Add logger for missing TypeParameter.
            typeParameterString = "???";
        }

        const type = GeneratorHelpers.ApiTypeToString(this.ExtractedData, this.Data.Type);

        return [`{${readonly}[${typeParameterString}]${optional}: ${type}}`];
    }

    public ToHeadingText(): string {
        return this.Data.Name;
    }
}
