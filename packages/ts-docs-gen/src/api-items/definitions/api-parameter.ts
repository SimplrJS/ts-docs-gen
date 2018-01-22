import { Contracts } from "ts-extractor";

import { ApiDefinitionWithType } from "../api-definition-with-type";
import { ReferenceRenderHandler } from "../../contracts/serialized-api-item";

export class ApiParameter extends ApiDefinitionWithType<Contracts.ApiParameterDto> {
    public ToText(render: ReferenceRenderHandler = this.DefaultReferenceRenderer): string[] {
        const name = this.Name;

        const initializerString = this.ApiItem.Initializer ? ` = ${this.ApiItem.Initializer}` : "";
        const isOptionalString = this.ApiItem.IsOptional ? "?" : "";

        const type = this.SerializedTypeToString(render, this.Type);

        return [
            `${name}${isOptionalString}: ${type}${initializerString}`
        ];
    }

    public ToHeadingText(): string {
        return this.Name;
    }
}
