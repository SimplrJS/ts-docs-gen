import { Contracts } from "ts-extractor";
import { ApiCallable } from "../api-callable";
import { ReferenceRenderHandler } from "../../contracts/serialized-api-item";

export class ApiConstruct extends ApiCallable<Contracts.ApiConstructDto> {
    public ToText(render: ReferenceRenderHandler = this.DefaultReferenceRenderer): string[] {
        return [
            `new ${this.CallableToString(render)};`
        ];
    }

    public ToHeadingText(): string {
        return this.Name;
    }
}
