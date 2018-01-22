import { Contracts } from "ts-extractor";

import { ApiDefinitionContainer } from "../api-definition-container";
import { ReferenceRenderHandler } from "../../contracts/serialized-api-item";

export class ApiNamespace extends ApiDefinitionContainer<Contracts.ApiNamespaceDto> {
    public ToText(render: ReferenceRenderHandler = this.DefaultReferenceRenderer): string[] {
        return [`namespace ${this.Name}`];
    }

    public ToHeadingText(): string {
        return this.Name;
    }
}
