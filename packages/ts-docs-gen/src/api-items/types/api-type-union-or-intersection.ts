import { Contracts } from "ts-extractor";
import { ApiTypeMembersBase } from "../api-type-members-base";
import { ReferenceRenderHandler } from "../../contracts/serialized-api-item";

/**
 * Examples:
 * - `Foo | Bar`
 * - `Foo & Bar`
 */
export class ApiTypeUnionOrIntersection extends ApiTypeMembersBase<Contracts.ApiUnionOrIntersectionTypeDto> {
    public ToText(render: ReferenceRenderHandler = this.DefaultReferenceRenderer): string[] {
        const character = this.ApiItem.ApiTypeKind === Contracts.ApiTypeKind.Union ? "|" : "&";

        return [
            this.Members.map(x => x.ToInlineText(render)).join(` ${character} `)
        ];
    }
}
