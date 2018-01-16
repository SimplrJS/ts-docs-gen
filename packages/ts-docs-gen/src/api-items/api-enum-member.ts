import { Contracts } from "ts-extractor";

import { BaseApiItem } from "../abstractions/base-api-item";

export class ApiEnumMember extends BaseApiItem<Contracts.ApiEnumMemberDto> {
    public ToStringArray(): string[] {
        const name = this.Data.Name;

        let value: string;
        if (this.Data.Value !== "") {
            value = ` = ${this.Data.Value}`;
        } else {
            value = "";
        }

        return [`${name}${value}`];
    }

    public ToSimpleString(): string {
        return this.Data.Name;
    }
}
