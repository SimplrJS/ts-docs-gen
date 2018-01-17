import { Contracts, ExtractDto } from "ts-extractor";

import { ApiParameter } from "./api-parameter";
import { ApiDefinitionWithType } from "../api-definition-with-type";
import { ApiItemReference } from "../../contracts/api-item-reference";

export class ApiIndex extends ApiDefinitionWithType<Contracts.ApiIndexDto> {
    constructor(extractedData: ExtractDto, apiItem: Contracts.ApiIndexDto, reference: ApiItemReference) {
        super(extractedData, apiItem, reference);

        this.parameter = this.getParameter();
    }

    private parameter: ApiParameter;

    public get Parameter(): ApiParameter {
        return this.parameter;
    }

    private getParameter(): ApiParameter {
        const apiItem = this.ExtractedData.Registry[this.Data.Parameter] as Contracts.ApiParameterDto;
        return new ApiParameter(this.ExtractedData, apiItem);
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
