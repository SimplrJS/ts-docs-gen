import { Contracts, ExtractDto } from "ts-extractor";

import { ApiDefinitionBase } from "../api-definition-base";
import { SerializedApiDefinition } from "../../contracts/serialized-api-item";

export class ApiNamespace extends ApiDefinitionBase<Contracts.ApiNamespaceDto> {
    constructor(extractedData: ExtractDto, apiItem: Contracts.ApiNamespaceDto) {
        super(extractedData, apiItem);

        this.members = this.GetMembers(this.Data.Members);
    }

    private members: Array<SerializedApiDefinition<Contracts.ApiItemDto>>;

    public get Members(): Array<SerializedApiDefinition<Contracts.ApiItemDto>> {
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
