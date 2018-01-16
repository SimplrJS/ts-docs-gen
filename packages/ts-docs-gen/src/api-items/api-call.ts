import { Contracts } from "ts-extractor";
import { ApiCallable } from "./api-callable";

export class ApiMethod extends ApiCallable<Contracts.ApiMethodDto> {
    public ToStringArray(): string[] {
        return [
            this.CallableToString()
        ];
    }

    public ToSimpleString(): string {
        return this.Data.Name;
    }
}
