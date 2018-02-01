import { Contracts } from "ts-extractor";
import { GeneratorHelpers } from "../../generator-helpers";
import { ApiTypes } from "../api-type-list";
import { ApiDefinitionContainer } from "../api-definition-container";
import { ApiTypeParameter } from "./api-type-parameter";
import { ReferenceRenderHandler } from "../../contracts/serialized-api-item";

export class ApiClass extends ApiDefinitionContainer<Contracts.ApiClassDto> {
    private typeParameters: ApiTypeParameter[] | undefined;

    public get TypeParameters(): ApiTypeParameter[] {
        if (this.typeParameters == null) {
            this.typeParameters = GeneratorHelpers
                .GetApiItemReferences(this.ExtractedData, this.ApiItem.TypeParameters)
                .map(x => this.GetSerializedApiDefinition(x) as ApiTypeParameter);
        }
        return this.typeParameters;
    }

    private extends: ApiTypes | undefined;

    public get Extends(): ApiTypes | undefined {
        return this.extends;
    }

    private implements: ApiTypes[] | undefined;

    public get Implements(): ApiTypes[] {
        if (this.implements == null) {
            this.implements = this.ApiItem.Implements
                .map(x => GeneratorHelpers.SerializeApiType(this.ExtractedData, x))
                .filter((x): x is ApiTypes => x != null);
        }
        return this.implements;
    }

    public ToText(render: ReferenceRenderHandler = this.DefaultReferenceRenderer): string[] {
        // Abstract
        const $abstract = this.ApiItem.IsAbstract ? "abstract " : "";

        // TypeParameters
        const typeParameters: string = this.TypeParametersToString(render, this.TypeParameters);

        // Extends
        let extendsString: string;
        if (this.Extends != null) {
            extendsString = ` extends ${this.Extends.ToInlineText()}`;
        } else {
            extendsString = "";
        }

        // Implements
        let implementsString: string;
        if (this.Implements.length > 0) {
            const implementsList = this.Implements.map(x => this.SerializedTypeToString(render, x));

            implementsString = ` implements ${implementsList.join(", ")}`;
        } else {
            implementsString = "";
        }

        return [
            `${$abstract}class ${this.Name}${typeParameters}${extendsString}${implementsString}`
        ];
    }

    public ToHeadingText(): string {
        return this.Name;
    }
}
