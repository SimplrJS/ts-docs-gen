import { Contracts } from "ts-extractor";

import { ApiDefinitionContainer } from "../api-definition-container";
import { ReferenceRenderHandler } from "../../contracts/serialized-api-item";

export class ApiNamespace extends ApiDefinitionContainer<Contracts.ApiNamespaceDto> {
    public ToText(render: ReferenceRenderHandler = this.DefaultReferenceRenderer): string[] {
        const name = this.Name;

        return [`namespace ${name}`];
    }

    public ToHeadingText(): string {
        return this.Name;
    }
}
