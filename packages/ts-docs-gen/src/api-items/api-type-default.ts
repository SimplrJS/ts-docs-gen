import { Contracts } from "ts-extractor";
import { ReferenceRenderHandler, SerializedApiType } from "../contracts/serialized-api-item";
import { BaseApiItemClass } from "../abstractions/base-api-item";

export class ApiTypeDefault<TKind extends Contracts.ApiBaseType = Contracts.ApiType>
    extends BaseApiItemClass<TKind> implements SerializedApiType<TKind> {
    public ToText(render: ReferenceRenderHandler = this.DefaultReferenceRenderer): string[] {
        return [
            this.ApiItem.Text
        ];
    }
}
