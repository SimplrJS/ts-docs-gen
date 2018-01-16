import { Contracts } from "ts-extractor";
import { ApiCallable } from "./api-callable";

export class ApiFunction extends ApiCallable<Contracts.ApiFunctionDto> {
    public ToText(alias?: string): string[] {
        const name = alias || this.Data.Name;

        return [
            `function ${name}${this.CallableToString()}`
        ];
    }

    public ToHeadingText(): string {
        return this.Data.Name;
    }
}
