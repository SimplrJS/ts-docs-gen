import { Contracts, ExtractDto } from "ts-extractor";
import { GeneratorHelpers } from "../../generator-helpers";
import { SerializedApiType } from "../../contracts/serialized-api-item";
import { ApiDefinitionBase } from "../api-definition-base";
import { ApiItemReference } from "../../contracts/api-item-reference";

export type ApiAccessorKinds = Contracts.ApiGetAccessorDto | Contracts.ApiSetAccessorDto;

export class ApiAccessor extends ApiDefinitionBase<ApiAccessorKinds> {
    constructor(extractedData: ExtractDto, apiItem: ApiAccessorKinds, reference: ApiItemReference) {
        super(extractedData, apiItem, reference);

        const resolvedType = this.resolveType();
        if (resolvedType != null) {
            this.type = GeneratorHelpers.SerializeApiType(this.ExtractedData, resolvedType);
        }
    }

    private type: SerializedApiType | undefined;

    public get Type(): SerializedApiType | undefined {
        return this.type;
    }

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

    public ToText(): string[] {
        const name = this.Reference.Alias || this.Data.Name;
        const abstract = this.Data.IsAbstract ? " abstract" : "";
        const $static = this.Data.IsStatic ? " static" : "";

        const typeString = this.SerializedTypeToString(this.Type);
        let accessorType: string;
        if (this.Data.ApiKind === Contracts.ApiItemKinds.SetAccessor) {
            accessorType = "set";
        } else {
            accessorType = "get";
        }

        return [`${this.Data.AccessModifier}${$static}${abstract} ${accessorType} ${name}: ${typeString};`];
    }

    public ToHeadingText(): string {
        return this.Reference.Alias || this.Data.Name;
    }
}
