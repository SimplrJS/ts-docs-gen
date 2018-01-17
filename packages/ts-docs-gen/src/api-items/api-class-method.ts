import { Contracts } from "ts-extractor";
import { ApiCallable } from "./api-callable";

export class ApiClassMethod extends ApiCallable<Contracts.ApiClassMethodDto> {
    public ToText(alias?: string): string[] {
        const name = alias || this.Data.Name;

        const optional = this.Data.IsOptional ? "?" : "";
        const abstract = this.Data.IsAbstract ? " abstract" : "";
        const async = this.Data.IsAsync ? " async" : "";
        const $static = this.Data.IsStatic ? " static" : "";
        const functionHeader = this.CallableToString(`${optional}: `);

        const access = this.Data.AccessModifier;

        return [`${access}${$static}${abstract}${async} ${name}${functionHeader}`.trim()];

    }

    public ToHeadingText(): string {
        return this.Data.Name;
    }
}
