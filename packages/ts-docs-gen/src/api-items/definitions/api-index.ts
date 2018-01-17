import { Contracts, ExtractDto } from "ts-extractor";

import { GeneratorHelpers } from "../../generator-helpers";
import { ApiParameter } from "./api-parameter";
import { SerializedApiType } from "../../contracts/serialized-api-item";
import { ApiDefinitionBase } from "../api-definition-base";

export class ApiIndex extends ApiDefinitionBase<Contracts.ApiIndexDto> {
    constructor(extractedData: ExtractDto, apiItem: Contracts.ApiIndexDto) {
        super(extractedData, apiItem);

        this.type = GeneratorHelpers.SerializeApiType(this.ExtractedData, this.Data.Type);
        this.parameter = this.getParameter();
    }

    private type: SerializedApiType | undefined;

    public get Type(): SerializedApiType | undefined {
        return this.type;
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
        return this.Data.Name;
    }
}
