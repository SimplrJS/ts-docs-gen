import { Contracts } from "ts-extractor";
import { ApiDefinitionContainer } from "../api-definition-container";
import { ReferenceRenderHandler } from "../../contracts/serialized-api-item";

export class ApiTypeLiteral extends ApiDefinitionContainer<Contracts.ApiTypeLiteralDto> {
    public ToText(render: ReferenceRenderHandler = this.DefaultReferenceRenderer): string[] {
        // Members
        const members = this.MembersToText(render, this.Members, 1);

        return [
            `{`,
            ...members,
            `}`
        ];
    }

    public ToHeadingText(): string {
        return this.Name;
    }
}
