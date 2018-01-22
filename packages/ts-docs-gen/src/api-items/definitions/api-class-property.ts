import { Contracts } from "ts-extractor";
import { ApiDefinitionWithType } from "../api-definition-with-type";
import { ReferenceRenderHandler } from "../../contracts/serialized-api-item";

export class ApiClassProperty extends ApiDefinitionWithType<Contracts.ApiClassPropertyDto> {
    public ToText(render: ReferenceRenderHandler = this.DefaultReferenceRenderer): string[] {
        const optional = this.ApiItem.IsOptional ? "?" : "";
        const readOnly = this.ApiItem.IsReadonly ? " readonly" : "";
        const $abstract = this.ApiItem.IsAbstract ? " abstract" : "";
        const $static = this.ApiItem.IsStatic ? " static" : "";

        const accessModifier = this.ApiItem.AccessModifier;
        const type = this.SerializedTypeToString(render, this.Type);

        return [`${accessModifier}${$static}${$abstract}${readOnly} ${this.Name}${optional}: ${type};`];
    }

    public ToHeadingText(): string {
        return this.Name;
    }
}
