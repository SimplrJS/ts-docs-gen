import { Contracts, TSHelpers } from "ts-extractor";
import { ApiTypeReferenceBase } from "../api-type-reference-base";
import { ReferenceRenderHandler } from "../../contracts/serialized-api-item";

export type TypeDefinitions = Contracts.TypeLiteralType |
    Contracts.MappedType |
    Contracts.FunctionTypeType |
    Contracts.ThisType |
    Contracts.ConstructorType;

export class ApiTypeDefinition<TKind extends Contracts.ApiReferenceBaseType = TypeDefinitions> extends ApiTypeReferenceBase<TKind> {
    public ToText(render: ReferenceRenderHandler = this.DefaultReferenceRenderer): string[] {
        if (this.ReferenceItem == null) {
            return [this.ApiItem.Text];
        }

        if (TSHelpers.IsInternalSymbolName(this.ReferenceItem.ApiItem.Name)) {
            return this.ReferenceItem.ToText(render);
        }

        return [render(this.ReferenceItem.Name, this.ApiItem.ReferenceId)];
    }
}
