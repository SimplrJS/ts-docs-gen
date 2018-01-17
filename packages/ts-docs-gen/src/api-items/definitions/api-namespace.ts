import { Contracts, ExtractDto } from "ts-extractor";

import { ApiDefinitionBase } from "../api-definition-base";
import { SerializedApiDefinition } from "../../contracts/serialized-api-item";

export class ApiNamespace extends ApiDefinitionBase<Contracts.ApiNamespaceDto> {
    constructor(extractedData: ExtractDto, apiItem: Contracts.ApiNamespaceDto) {
        super(extractedData, apiItem);

        this.members = this.GetMembers(this.Data.Members);
    }

    private members: SerializedApiDefinition[];

    public get Members(): SerializedApiDefinition[] {
        return this.members;
    }

    public ToText(alias?: string): string[] {
        const name = alias || this.Data.Name;

        return [`namespace ${name}`];
    }

    public ToHeadingText(): string {
        return this.Data.Name;
    }
}
