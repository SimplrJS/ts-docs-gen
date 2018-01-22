import { Contracts } from "ts-extractor";
import { ApiTypeBase } from "./api-type-base";
import { ReferenceRenderHandler } from "../contracts/serialized-api-item";

export class ApiTypeDefault extends ApiTypeBase<Contracts.ApiType> {
    public ToText(render: ReferenceRenderHandler = this.DefaultReferenceRenderer): string[] {
        return [
            this.ApiItem.Text
        ];
    }
}
