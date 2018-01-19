import { Contracts } from "ts-extractor";
import { ApiTypeMembersBase } from "../api-type-members-base";

/**
 * Examples:
 * - `Foo | Bar`
 * - `Foo & Bar`
 */
export class ApiTypeUnionOrIntersection extends ApiTypeMembersBase<Contracts.ApiUnionOrIntersectionType> {
    public ToText(): string[] {
        const character = this.ApiItem.ApiTypeKind === Contracts.ApiTypeKind.Union ? "|" : "&";

        return [
            this.Members.map(x => x.ToInlineText()).join(` ${character} `)
        ];
    }
}
