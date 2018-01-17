import { Contracts } from "ts-extractor";
import { ApiDefinitionWithType } from "../api-definition-with-type";

export class ApiClassProperty extends ApiDefinitionWithType<Contracts.ApiClassPropertyDto> {
    public ToText(): string[] {
        const name = this.Reference.Alias || this.Data.Name;

        const optional = this.Data.IsOptional ? "?" : "";
        const readOnly = this.Data.IsReadonly ? " readonly" : "";
        const abstract = this.Data.IsAbstract ? " abstract" : "";
        const $static = this.Data.IsStatic ? " static" : "";

        const access = this.Data.AccessModifier;
        const type = this.SerializedTypeToString(this.Type);

        return [`${access}${$static}${abstract}${readOnly} ${name}${optional}: ${type};`];
    }

    public ToHeadingText(): string {
        return this.Reference.Alias || this.Data.Name;
    }
}
