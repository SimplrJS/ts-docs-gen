import { Contracts } from "ts-extractor";
import { ApiCallable } from "../api-callable";

export class ApiMethod extends ApiCallable<Contracts.ApiMethodDto> {
    public ToText(alias?: string): string[] {
        const name = alias || this.Data.Name;

        const optional = this.Data.IsOptional ? "?" : "";

        return [
            `${name}${this.CallableToString(`${optional}: `)};`
        ];
    }

    public ToHeadingText(): string {
        return this.Data.Name;
    }
}
