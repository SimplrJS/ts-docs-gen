import { Contracts } from "ts-extractor";

import { BaseApiItemClass } from "../../abstractions/base-api-item";

export class ApiEnumMember extends BaseApiItemClass<Contracts.ApiEnumMemberDto> {
    public ToText(): string[] {
        const name = this.Data.Name;

        let value: string;
        if (this.Data.Value !== "") {
            value = ` = ${this.Data.Value}`;
        } else {
            value = "";
        }

        return [`${name}${value}`];
    }

    public ToHeadingText(): string {
        return this.Data.Name;
    }
}
