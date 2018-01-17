import { Contracts, ExtractDto } from "ts-extractor";

import { ApiTypeParameter } from "./api-type-parameter";
import { ApiItemReference } from "../../contracts/api-item-reference";
import { ApiDefinitionWithType } from "../api-definition-with-type";

export class ApiMapped extends ApiDefinitionWithType<Contracts.ApiMappedDto> {
    constructor(extractedData: ExtractDto, apiItem: Contracts.ApiMappedDto, reference: ApiItemReference) {
        super(extractedData, apiItem, reference);

        this.typeParameter = this.getTypeParameter();
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
        return this.Reference.Alias || this.Data.Name;
    }
}
