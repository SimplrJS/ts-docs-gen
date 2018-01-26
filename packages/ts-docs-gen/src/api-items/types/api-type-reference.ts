import { Contracts } from "ts-extractor";
import { ApiTypeReferenceBase } from "../api-type-reference-base";
import { ApiTypes } from "../api-type-list";
import { ReferenceRenderHandler } from "../../contracts/serialized-api-item";

/**
 * Examples:
 * - `Foo`
 * - `Foo<string>`
 */
export class ApiTypeReference extends ApiTypeReferenceBase<Contracts.ApiReferenceTypeDto> {
    private typeParameters: ApiTypes[] | undefined;

    public get TypeParameters(): ApiTypes[] | undefined {
        if (this.typeParameters == null && this.ApiItem.TypeParameters != null) {
            this.typeParameters = this.GetTypeParameters(this.ApiItem.TypeParameters);
        }
        return this.typeParameters;
    }

    public ToText(render: ReferenceRenderHandler = this.DefaultReferenceRenderer): string[] {
        const typeParameters = this.TypeParametersToString(render, this.TypeParameters);

        // Resolve name
        let name: string;
        if (this.ReferenceItem != null) {
            name = this.ReferenceItem.Name;
        } else {
            name = this.ApiItem.SymbolName || this.ApiItem.Text;
        }

        // Rendered reference
        const renederedName = render(name, this.ApiItem.ReferenceId);

        return [
            `${renederedName}${typeParameters}`
        ];
    }
}
