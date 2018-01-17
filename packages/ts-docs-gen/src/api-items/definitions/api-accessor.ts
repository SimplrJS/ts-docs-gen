import { Contracts } from "ts-extractor";
import { BaseApiItemClass } from "../../abstractions/base-api-item";
import { GeneratorHelpers } from "../../generator-helpers";

export type ApiAccessorKinds = Contracts.ApiGetAccessorDto | Contracts.ApiSetAccessorDto;

export class ApiAccessor extends BaseApiItemClass<ApiAccessorKinds> {
    private resolveType(): Contracts.ApiType | undefined {
        let type: Contracts.ApiType | undefined;
        if (this.Data.ApiKind === Contracts.ApiItemKinds.GetAccessor) {
            // GetAccessor

            type = this.Data.Type;
        } else if (this.Data.Parameter != null) {
            // SetAccessor

            const apiParameter = this.ExtractedData.Registry[this.Data.Parameter.Ids[0]] as Contracts.ApiParameterDto;
            if (apiParameter != null) {
                type = apiParameter.Type;
            }
        }

        return type;
    }

    public ToText(alias?: string | undefined): string[] {
        const name = alias || this.Data.Name;
        const abstract = this.Data.IsAbstract ? " abstract" : "";
        const $static = this.Data.IsStatic ? " static" : "";

        const typeString = GeneratorHelpers.ApiTypeToString(this.ExtractedData, this.resolveType());
        let accessorType: string;
        if (this.Data.ApiKind === Contracts.ApiItemKinds.SetAccessor) {
            accessorType = "set";
        } else {
            accessorType = "get";
        }

        return [`${this.Data.AccessModifier}${$static}${abstract} ${accessorType} ${name}: ${typeString};`];
    }

    public ToHeadingText(alias?: string | undefined): string {
        return alias || this.Data.Name;
    }
}
