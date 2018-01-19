import { Contracts } from "ts-extractor";
import { ApiCallable } from "../api-callable";

export class ApiFunction extends ApiCallable<Contracts.ApiFunctionDto> {
    public ToText(): string[] {
        const name = this.Name;

        return [
            `function ${name}${this.CallableToString()}`
        ];
    }

    public ToHeadingText(): string {
        return this.Name;
    }
}
