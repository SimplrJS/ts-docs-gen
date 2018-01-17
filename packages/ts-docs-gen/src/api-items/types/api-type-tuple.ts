import { Contracts } from "ts-extractor";
import { ApiTypeMembersBase } from "../api-type-members-base";

/**
 * Example: `[string, number]`.
 */
export class ApiTypeTuple extends ApiTypeMembersBase<Contracts.TupleType> {
    public ToText(): string[] {
        return [
            `[${this.Members.join(`, `)}]`
        ];
    }
}
