import { Contracts } from "ts-extractor";
import { ApiCallable } from "./api-callable";

export class ApiConstruct extends ApiCallable<Contracts.ApiConstructDto> {
    public ToText(): string[] {
        return [
            `new ${this.CallableToString(undefined)};`
        ];
    }

    public ToHeadingText(): string {
        return this.Data.Name;
    }
}
