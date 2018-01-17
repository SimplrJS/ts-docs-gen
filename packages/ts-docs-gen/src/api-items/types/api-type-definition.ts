import { Contracts } from "ts-extractor";
import { ApiTypeReferenceBase } from "../api-type-reference-base";

export class ApiTypeDefinition<TKind extends Contracts.ApiReferenceBaseType> extends ApiTypeReferenceBase<TKind> {
    public ToText(): string[] {
        if (this.ReferenceItem == null) {
            return ["???"];
        }

        return this.ReferenceItem.ToText();
    }
}
