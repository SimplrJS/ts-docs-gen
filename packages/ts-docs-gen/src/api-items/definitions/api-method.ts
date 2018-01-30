import { Contracts } from "ts-extractor";
import { ApiCallable } from "../api-callable";
import { ReferenceRenderHandler } from "../../contracts/serialized-api-item";

export class ApiMethod extends ApiCallable<Contracts.ApiMethodDto> {
    public ToText(render: ReferenceRenderHandler = this.DefaultReferenceRenderer): string[] {
        const optional = this.ApiItem.IsOptional ? "?" : "";

        return [
            `${this.Name}${this.CallableToString(render, `${optional}: `)};`
        ];
    }

    public ToHeadingText(): string {
        return this.Name;
    }
}
