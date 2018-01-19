import { Contracts } from "ts-extractor";
import { ApiTypeReferenceBase } from "../api-type-reference-base";
import { ApiTypes } from "../api-type-list";

/**
 * Examples:
 * - `Foo`
 * - `Foo<string>`
 */
export class ApiTypeReference extends ApiTypeReferenceBase<Contracts.ApiReferenceType> {
    private typeParameters: ApiTypes[] | undefined;

    public get TypeParameters(): ApiTypes[] | undefined {
        if (this.typeParameters == null && this.ApiItem.TypeParameters != null) {
            this.typeParameters = this.GetTypeParameters(this.ApiItem.TypeParameters);
        }
        return this.typeParameters;
    }

    public ToText(): string[] {
        const typeParameters = this.TypeParametersToString(this.TypeParameters);

        let name: string;
        if (this.ReferenceItem != null) {
            name = this.ReferenceItem.Name;
        } else {
            name = this.ApiItem.SymbolName || this.ApiItem.Text;
        }

        return [
            `${name}${typeParameters}`
        ];
    }
}
