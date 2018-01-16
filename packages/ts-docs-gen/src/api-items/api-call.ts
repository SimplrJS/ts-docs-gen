import { Contracts } from "ts-extractor";
import { ApiCallable } from "./api-callable";

export class ApiCall extends ApiCallable<Contracts.ApiCallDto> {
    public ToText(): string[] {
        return [
            this.CallableToString()
        ];
    }

    public ToHeadingText(): string {
        return this.Data.Name;
    }
}
