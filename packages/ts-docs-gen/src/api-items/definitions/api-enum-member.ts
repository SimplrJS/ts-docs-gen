import { Contracts } from "ts-extractor";
import { ApiDefinitionBase } from "../api-definition-base";
import { ReferenceRenderHandler } from "../../contracts/serialized-api-item";

export class ApiEnumMember extends ApiDefinitionBase<Contracts.ApiEnumMemberDto> {
    public ToText(render: ReferenceRenderHandler = this.DefaultReferenceRenderer): string[] {
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
