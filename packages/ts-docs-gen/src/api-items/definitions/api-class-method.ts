import { Contracts } from "ts-extractor";
import { ApiCallable } from "../api-callable";
import { ReferenceRenderHandler } from "../../contracts/serialized-api-item";

export class ApiClassMethod extends ApiCallable<Contracts.ApiClassMethodDto> {
    public ToText(render: ReferenceRenderHandler = this.DefaultReferenceRenderer): string[] {
        const optional = this.ApiItem.IsOptional ? "?" : "";
        const $abstract = this.ApiItem.IsAbstract ? " abstract" : "";
        const async = this.ApiItem.IsAsync ? " async" : "";
        const $static = this.ApiItem.IsStatic ? " static" : "";
        const functionHeader = this.CallableToString(render, `${optional}: `);

        const accessModifier = this.ApiItem.AccessModifier;

        return [`${accessModifier}${$static}${$abstract}${async} ${this.Name}${functionHeader};`];

    }

    public ToHeadingText(): string {
        return `${this.Name}${this.CallableToSimpleString()}`;
    }
}
