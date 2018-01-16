import { Contracts } from "ts-extractor";
import { ApiCallable } from "./api-callable";

export class ApiFunctionType extends ApiCallable<Contracts.ApiFunctionTypeDto> {
    public ToStringArray(): string[] {
        return [
            this.CallableToString(" => ")
        ];
    }

    public ToSimpleString(): string {
        return this.Data.Name;
    }
}
