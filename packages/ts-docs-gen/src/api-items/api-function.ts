import { Contracts } from "ts-extractor";
import { ApiCallable } from "./api-callable";

export class ApiFunction extends ApiCallable<Contracts.ApiFunctionDto> {
    public ToStringArray(alias?: string): string[] {
        const name = alias || this.Data.Name;

        return [
            `function ${name}${this.CallableToString()}`
        ];
    }

    public ToSimpleString(): string {
        return this.Data.Name;
    }
}
