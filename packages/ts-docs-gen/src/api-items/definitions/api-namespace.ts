import { Contracts } from "ts-extractor";

import { ApiDefinitionContainer } from "../api-definition-container";

export class ApiNamespace extends ApiDefinitionContainer<Contracts.ApiNamespaceDto> {
    public ToText(): string[] {
        const name = this.Reference.Alias || this.Data.Name;

        return [`namespace ${name}`];
    }

    public ToHeadingText(): string {
        return this.Reference.Alias || this.Data.Name;
    }
}
