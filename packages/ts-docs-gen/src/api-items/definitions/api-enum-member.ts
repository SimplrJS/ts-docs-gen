import { Contracts } from "ts-extractor";
import { ApiDefinitionBase } from "../api-definition-base";
import { ReferenceRenderHandler } from "../../contracts/serialized-api-item";

export class ApiEnumMember extends ApiDefinitionBase<Contracts.ApiEnumMemberDto> {
    public get Name(): string {
        const name = this.Reference.Alias || this.ApiItem.Name;
        if (this.ParentItem == null) {
            return name;
        }

        return `${this.ParentItem.Name}.${name}`;
    }

    public ToText(render: ReferenceRenderHandler = this.DefaultReferenceRenderer): string[] {
        const name = render(this.ApiItem.Name, this.Reference.Id);

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
