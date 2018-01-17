import { Contracts } from "ts-extractor";
import { BaseApiItemClass } from "../../abstractions/base-api-item";
import { GeneratorHelpers } from "../../generator-helpers";

export class ApiClassProperty extends BaseApiItemClass<Contracts.ApiClassPropertyDto> {
    public ToText(alias?: string | undefined): string[] {
        const name = alias || this.Data.Name;

        const optional = this.Data.IsOptional ? "?" : "";
        const readOnly = this.Data.IsReadonly ? " readonly" : "";
        const abstract = this.Data.IsAbstract ? " abstract" : "";
        const $static = this.Data.IsStatic ? " static" : "";

        const access = this.Data.AccessModifier;
        const type = GeneratorHelpers.ApiTypeToString(this.ExtractedData, this.Data.Type);

        return [`${access}${$static}${abstract}${readOnly} ${name}${optional}: ${type};`];
    }

    public ToHeadingText(alias?: string | undefined): string {
        return alias || this.Data.Name;
    }
}
