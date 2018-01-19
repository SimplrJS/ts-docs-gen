import { Contracts } from "ts-extractor";
import { GeneratorHelpers } from "../../generator-helpers";
import { ApiDefinitionBase } from "../api-definition-base";
import { ApiTypes } from "../api-type-list";

export type ApiAccessorKinds = Contracts.ApiGetAccessorDto | Contracts.ApiSetAccessorDto;

export class ApiAccessor extends ApiDefinitionBase<ApiAccessorKinds> {
    private type: ApiTypes | undefined;

    public get Type(): ApiTypes | undefined {
        if (this.type != null) {
            const resolvedType = this.resolveType();
            if (resolvedType != null) {
                this.type = GeneratorHelpers.SerializeApiType(this.ExtractedData, resolvedType);
            }
        }
        return this.type;
    }

    private resolveType(): Contracts.ApiType | undefined {
        let type: Contracts.ApiType | undefined;
        if (this.ApiItem.ApiKind === Contracts.ApiItemKinds.GetAccessor) {
            // GetAccessor
            type = this.ApiItem.Type;
        } else if (this.ApiItem.Parameter != null) {
            // SetAccessor
            const apiParameter = this.ExtractedData.Registry[this.ApiItem.Parameter.Ids[0]] as Contracts.ApiParameterDto;
            if (apiParameter != null) {
                type = apiParameter.Type;
            }
        }

        return type;
    }

    public ToText(): string[] {
        const name = this.Reference.Alias || this.Name;
        const $abstract = this.ApiItem.IsAbstract ? " abstract" : "";
        const $static = this.ApiItem.IsStatic ? " static" : "";

        const typeString = this.SerializedTypeToString(this.Type);
        let accessorType: string;
        if (this.ApiItem.ApiKind === Contracts.ApiItemKinds.SetAccessor) {
            accessorType = "set";
        } else {
            accessorType = "get";
        }

        return [`${this.ApiItem.AccessModifier}${$static}${$abstract} ${accessorType} ${name}: ${typeString};`];
    }

    public ToHeadingText(): string {
        return this.Reference.Alias || this.Name;
    }
}
