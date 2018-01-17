import { Contracts, ExtractDto } from "ts-extractor";
import { ApiDefinitionBase } from "../api-definition-base";
import { SerializedApiDefinition } from "../../contracts/serialized-api-item";

export class ApiTypeLiteral extends ApiDefinitionBase<Contracts.ApiTypeLiteralDto> {
    constructor(extractedData: ExtractDto, apiItem: Contracts.ApiTypeLiteralDto) {
        super(extractedData, apiItem);

        this.members = this.GetMembers(this.Data.Members);
    }

    private members: Array<SerializedApiDefinition<Contracts.ApiItemDto>>;

    public get Members(): Array<SerializedApiDefinition<Contracts.ApiItemDto>> {
        return this.members;
    }

    public ToText(alias?: string): string[] {
        // Members
        const members = this.MembersToText(this.Members, 1);

        return [
            `{`,
            ...members,
            `}`
        ];
    }

    public ToHeadingText(alias?: string | undefined): string {
        return alias || this.Data.Name;
    }
}
