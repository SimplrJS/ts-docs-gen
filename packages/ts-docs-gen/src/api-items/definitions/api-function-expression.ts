import { Contracts } from "ts-extractor";
import { ApiCallable } from "../api-callable";
import { ReferenceRenderHandler } from "../../contracts/serialized-api-item";

// TODO: Rename it.
export class ApiFunctionExpression extends ApiCallable<Contracts.ApiFunctionExpressionDto> {
    public ToText(render: ReferenceRenderHandler = this.DefaultReferenceRenderer): string[] {
        return [
            this.CallableToString(render, " => ")
        ];
    }

    public ToHeadingText(): string {
        return this.Name;
    }
}
