import { Contracts } from "ts-extractor";
import { ApiDefinitionBase } from "../api-definition-base";

export class ApiTypeLiteral extends ApiDefinitionBase<Contracts.ApiTypeLiteralDto> {
    public ToText(alias?: string): string[] {
        // Members
        const members = this.MembersToText(this.Data.Members, 1);

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
