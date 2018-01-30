import { Contracts } from "ts-extractor";
import { TsHelpers } from "ts-extractor/dist/internal";
import { ApiTypeReferenceBase } from "../api-type-reference-base";
import { ReferenceRenderHandler } from "../../contracts/serialized-api-item";

export type TypeDefinitions = Contracts.TypeLiteralTypeDto |
    Contracts.MappedTypeDto |
    Contracts.FunctionTypeTypeDto |
    Contracts.ThisTypeDto |
    Contracts.ConstructorTypeDto;

export class ApiTypeDefinition<TKind extends Contracts.ApiReferenceBaseType = TypeDefinitions> extends ApiTypeReferenceBase<TKind> {
    public ToText(render: ReferenceRenderHandler = this.DefaultReferenceRenderer): string[] {
        if (this.ReferenceItem == null) {
            return [this.ApiItem.Text];
        }

        if (TsHelpers.IsInternalSymbolName(this.ReferenceItem.ApiItem.Name)) {
            return this.ReferenceItem.ToText(render);
        }

        return [render(this.ReferenceItem.Name, this.ApiItem.ReferenceId)];
    }
}
