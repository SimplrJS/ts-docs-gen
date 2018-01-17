import { Contracts } from "ts-extractor";
import { ApiTypeMembersBase } from "../api-type-members-base";

/**
 * Example: `Foo | Bar` or `Foo & Bar`.
 */
export class ApiTypeUnionOrIntersection extends ApiTypeMembersBase<Contracts.ApiUnionOrIntersectionType> {
    public ToText(): string[] {
        const character = this.Data.ApiTypeKind === Contracts.ApiTypeKind.Union ? "|" : "&";

        return [
            this.Members.join(` ${character} `)
        ];
    }
}
