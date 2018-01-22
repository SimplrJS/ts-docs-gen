import { Contracts } from "ts-extractor";
import { ApiTypeMembersBase } from "../api-type-members-base";
import { ReferenceRenderHandler } from "../../contracts/serialized-api-item";

/**
 * Example: `[string, number]`.
 */
export class ApiTypeTuple extends ApiTypeMembersBase<Contracts.TupleType> {
    public ToText(render: ReferenceRenderHandler = this.DefaultReferenceRenderer): string[] {
        return [
            `[${this.Members.map(x => x.ToInlineText(render)).join(`, `)}]`
        ];
    }
}
