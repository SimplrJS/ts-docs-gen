import { Contracts } from "ts-extractor";

import { ApiParameter } from "./api-parameter";
import { ApiDefinitionWithType } from "../api-definition-with-type";
import { ReferenceRenderHandler } from "../../contracts/serialized-api-item";

export class ApiIndex extends ApiDefinitionWithType<Contracts.ApiIndexDto> {
    private parameter: ApiParameter | undefined;

    public get Parameter(): ApiParameter {
        if (this.parameter == null) {
            const apiItem = this.ExtractedData.Registry[this.ApiItem.Parameter] as Contracts.ApiParameterDto;
            this.parameter = new ApiParameter(this.ExtractedData, apiItem, { Alias: apiItem.Name, Id: this.ApiItem.Parameter });
        }
        return this.parameter;
    }

    public ToText(render: ReferenceRenderHandler = this.DefaultReferenceRenderer): string[] {
        const readonly: string = this.ApiItem.IsReadonly ? "readonly " : "";
        const type: string = this.SerializedTypeToString(render, this.Type);

        return [`${readonly}[${this.Parameter.ToInlineText(render)}]: ${type};`];
    }

    public ToHeadingText(): string {
        return this.Name;
    }
}
