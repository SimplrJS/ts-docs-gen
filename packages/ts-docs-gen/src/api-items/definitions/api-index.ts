import { Contracts } from "ts-extractor";

import { ApiParameter } from "./api-parameter";
import { ApiDefinitionWithType } from "../api-definition-with-type";

export class ApiIndex extends ApiDefinitionWithType<Contracts.ApiIndexDto> {
    private parameter: ApiParameter;

    public get Parameter(): ApiParameter {
        if (this.parameter == null) {
            const apiItem = this.ExtractedData.Registry[this.Data.Parameter] as Contracts.ApiParameterDto;
            this.parameter = new ApiParameter(this.ExtractedData, apiItem, { Alias: "", Id: this.Data.Parameter });
        }
        return this.parameter;
    }

    public ToText(): string[] {
        const readonly: string = this.Data.IsReadonly ? "readonly " : "";
        const type: string = this.SerializedTypeToString(this.Type);

        return [`${readonly}[${this.Parameter.ToText().join(" ")}]: ${type}`];
    }

    public ToHeadingText(): string {
        return this.Reference.Alias || this.Data.Name;
    }
}
