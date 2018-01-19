import { Contracts } from "ts-extractor";
import { ApiDefinitionBase } from "../api-definition-base";

export class ApiEnumMember extends ApiDefinitionBase<Contracts.ApiEnumMemberDto> {
    public ToText(): string[] {
        const name = this.Name;

        let value: string;
        if (this.ApiItem.Value !== "") {
            value = ` = ${this.ApiItem.Value}`;
        } else {
            value = "";
        }

        return [`${name}${value}`];
    }

    public ToHeadingText(): string {
        return this.Name;
    }
}
