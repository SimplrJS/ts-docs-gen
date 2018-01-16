import { Contracts } from "ts-extractor";
import { ApiCallable } from "./api-callable";

export class ApiMethod extends ApiCallable<Contracts.ApiMethodDto> {
    public ToText(alias?: string): string[] {
        const name = alias || this.Data.Name;

        return [
            `${name}${this.CallableToString()};`
        ];
    }

    public ToHeadingText(): string {
        return this.Data.Name;
    }
}
