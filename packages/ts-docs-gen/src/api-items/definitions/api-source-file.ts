import { Contracts } from "ts-extractor";

import { ApiDefinitionContainer } from "../api-definition-container";
import { ReferenceRenderHandler } from "../../contracts/serialized-api-item";

export class ApiSourceFile extends ApiDefinitionContainer<Contracts.ApiSourceFileDto> {
    public ToText(render: ReferenceRenderHandler = this.DefaultReferenceRenderer): string[] {
        return this.MembersToText(render, this.Members);
    }

    public ToHeadingText(): string {
        return this.Name;
    }
}
