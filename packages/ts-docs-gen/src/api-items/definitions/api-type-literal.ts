import { Contracts } from "ts-extractor";
import { ApiBase } from "./api-base";

export class ApiTypeLiteral extends ApiBase<Contracts.ApiTypeLiteralDto> {
    public ToText(): string[] {
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
