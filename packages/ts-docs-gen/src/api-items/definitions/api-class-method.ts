import { Contracts } from "ts-extractor";
import { ApiCallable } from "../api-callable";

export class ApiClassMethod extends ApiCallable<Contracts.ApiClassMethodDto> {
    public ToText(): string[] {
        const name = this.Reference.Alias || this.Name;

        const optional = this.ApiItem.IsOptional ? "?" : "";
        const $abstract = this.ApiItem.IsAbstract ? " abstract" : "";
        const async = this.ApiItem.IsAsync ? " async" : "";
        const $static = this.ApiItem.IsStatic ? " static" : "";
        const functionHeader = this.CallableToString(`${optional}: `);

        const accessModifier = this.ApiItem.AccessModifier;

        return [`${accessModifier}${$static}${$abstract}${async} ${name}${functionHeader}`.trim()];

    }

    public ToHeadingText(): string {
        return this.Name;
    }
}
