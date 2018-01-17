import { Contracts } from "ts-extractor";
import { ApiCallable } from "./api-callable";

export class ApiFunctionType extends ApiCallable<Contracts.ApiFunctionTypeDto> {
    public ToText(): string[] {
        return [
            this.CallableToString(" => ")
        ];
    }

    public ToHeadingText(): string {
        return this.Data.Name;
    }
}
