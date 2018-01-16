import { Contracts } from "ts-extractor";
import { ApiCallable } from "./api-callable";

export class ApiConstruct extends ApiCallable<Contracts.ApiConstructDto> {
    public ToStringArray(): string[] {
        return [
            `new ${this.CallableToString(undefined)};`
        ];
    }

    public ToSimpleString(): string {
        return this.Data.Name;
    }
}
