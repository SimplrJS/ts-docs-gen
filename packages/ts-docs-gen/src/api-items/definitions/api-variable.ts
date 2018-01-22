import { Contracts } from "ts-extractor";

import { ApiDefinitionWithType } from "../api-definition-with-type";
import { ReferenceRenderHandler } from "../../contracts/serialized-api-item";

export class ApiVariable extends ApiDefinitionWithType<Contracts.ApiVariableDto> {
    public ToText(render: ReferenceRenderHandler = this.DefaultReferenceRenderer): string[] {
        const type = this.SerializedTypeToString(render, this.Type);

        return [
            `${this.ApiItem.VariableDeclarationType} ${this.Name}: ${type};`
        ];
    }

    public ToHeadingText(): string {
        return this.Name;
    }
}
