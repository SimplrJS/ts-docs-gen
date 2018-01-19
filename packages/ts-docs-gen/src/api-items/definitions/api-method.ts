import { Contracts } from "ts-extractor";
import { ApiCallable } from "../api-callable";

export class ApiMethod extends ApiCallable<Contracts.ApiMethodDto> {
    public ToText(): string[] {
        const name = this.Reference.Alias || this.Name;

        const optional = this.ApiItem.IsOptional ? "?" : "";

        return [
            `${name}${this.CallableToString(`${optional}: `)};`
        ];
    }

    public ToHeadingText(): string {
        return this.Reference.Alias || this.Name;
    }
}
