import { Contracts } from "ts-extractor";

import { BaseApiItem } from "../abstractions/base-api-item";
import { GeneratorHelpers } from "../generator-helpers";
import { ApiParameter } from "./api-parameter";

export class ApiIndex extends BaseApiItem<Contracts.ApiIndexDto> {
    protected GetParameter(): ApiParameter {
        const apiItem = this.ExtractedData.Registry[this.Data.Parameter] as Contracts.ApiParameterDto;
        return new ApiParameter(this.ExtractedData, apiItem);
    }

    public ToStringArray(): string[] {
        const parameter = this.GetParameter();

        const readonly: string = this.Data.IsReadonly ? "readonly " : "";
        const type: string = GeneratorHelpers.ApiTypeToString(this.ExtractedData, this.Data.Type);

        return [`${readonly}[${parameter.ToString()}]: ${type}`];
    }

    public ToSimpleString(): string {
        return this.Data.Name;
    }
}
