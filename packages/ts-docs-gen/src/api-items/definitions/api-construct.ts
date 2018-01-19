import { Contracts } from "ts-extractor";
import { ApiCallable } from "../api-callable";

export class ApiConstruct extends ApiCallable<Contracts.ApiConstructDto> {
    public ToText(): string[] {
        return [
            `new ${this.CallableToString()};`
        ];
    }

    public ToHeadingText(): string {
        return this.Reference.Alias || this.Name;
    }
}
