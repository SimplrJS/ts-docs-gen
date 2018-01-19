import { Contracts } from "ts-extractor";
import { ApiDefinitionWithType } from "../api-definition-with-type";

export class ApiClassProperty extends ApiDefinitionWithType<Contracts.ApiClassPropertyDto> {
    public ToText(): string[] {
        const name = this.Reference.Alias || this.Name;

        const optional = this.ApiItem.IsOptional ? "?" : "";
        const readOnly = this.ApiItem.IsReadonly ? " readonly" : "";
        const $abstract = this.ApiItem.IsAbstract ? " abstract" : "";
        const $static = this.ApiItem.IsStatic ? " static" : "";

        const accessModifier = this.ApiItem.AccessModifier;
        const type = this.SerializedTypeToString(this.Type);

        return [`${accessModifier}${$static}${$abstract}${readOnly} ${name}${optional}: ${type};`];
    }

    public ToHeadingText(): string {
        return this.Reference.Alias || this.Name;
    }
}
