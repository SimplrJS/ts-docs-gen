import { Contracts } from "ts-extractor";
import { ApiCallable } from "../api-callable";

export class ApiClassConstructor extends ApiCallable<Contracts.ApiClassConstructorDto> {
    public ToText(): string[] {
        return [
            `${this.ApiItem.AccessModifier} constructor${this.CallableToString(undefined)};`
        ];
    }

    public ToHeadingText(): string {
        return this.Name;
    }
}
