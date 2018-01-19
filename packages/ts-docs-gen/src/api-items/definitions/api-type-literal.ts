import { Contracts } from "ts-extractor";
import { ApiDefinitionContainer } from "../api-definition-container";

export class ApiTypeLiteral extends ApiDefinitionContainer<Contracts.ApiTypeLiteralDto> {
    public ToText(): string[] {
        // Members
        const members = this.MembersToText(this.Members, 1);

        return [
            `{`,
            ...members,
            `}`
        ];
    }

    public ToHeadingText(): string {
        return this.Reference.Alias || this.Name;
    }
}
