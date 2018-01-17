import { Contracts } from "ts-extractor";
import { ApiTypeBase } from "./api-type-base";

export class ApiTypeDefault extends ApiTypeBase<Contracts.ApiType> {
    public ToText(): string[] {
        return [
            this.Data.Text
        ];
    }
}
