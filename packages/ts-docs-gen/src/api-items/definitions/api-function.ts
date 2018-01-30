import { Contracts } from "ts-extractor";
import { ApiCallable } from "../api-callable";
import { ReferenceRenderHandler } from "../../contracts/serialized-api-item";

export class ApiFunction extends ApiCallable<Contracts.ApiFunctionDto> {
    public ToText(render: ReferenceRenderHandler = this.DefaultReferenceRenderer): string[] {
        return [
            `function ${this.Name}${this.CallableToString(render)};`
        ];
    }

    public ToHeadingText(): string {
        return this.Name;
    }
}
