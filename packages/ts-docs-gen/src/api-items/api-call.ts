import { Contracts } from "ts-extractor";
import { ApiCallable } from "./api-callable";

export class ApiMethod extends ApiCallable<Contracts.ApiMethodDto> {
    public ToText(): string[] {
        return [
            this.CallableToString()
        ];
    }

    public ToHeadingText(): string {
        return this.Data.Name;
    }
}
