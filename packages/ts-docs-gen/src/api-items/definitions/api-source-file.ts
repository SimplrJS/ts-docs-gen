import { Contracts } from "ts-extractor";

import { ApiDefinitionContainer } from "../api-definition-container";

export class ApiSourceFile extends ApiDefinitionContainer<Contracts.ApiSourceFileDto> {
    public ToText(): string[] {
        return this.MembersToText(this.Members);
    }

    public ToHeadingText(): string {
        return this.Name;
    }
}
