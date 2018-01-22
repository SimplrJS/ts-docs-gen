import { Contracts } from "ts-extractor";
import { ApiCallable } from "../api-callable";
import { ReferenceRenderHandler } from "../../contracts/serialized-api-item";

export class ApiClassConstructor extends ApiCallable<Contracts.ApiClassConstructorDto> {
    public ToText(render: ReferenceRenderHandler = this.DefaultReferenceRenderer): string[] {
        return [
            `${this.ApiItem.AccessModifier} constructor${this.CallableToString(render, undefined)};`
        ];
    }

    public ToHeadingText(): string {
        return this.Name;
    }
}
