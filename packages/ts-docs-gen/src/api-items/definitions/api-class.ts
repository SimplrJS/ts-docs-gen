import { Contracts, ExtractDto } from "ts-extractor";
import { GeneratorHelpers } from "../../generator-helpers";
import { ApiItemReference } from "../../contracts/api-item-reference";
import { ApiTypes } from "../api-type-list";
import { ApiDefinitionContainer } from "../api-definition-container";
import { ApiTypeParameter } from "./api-type-parameter";

export class ApiClass extends ApiDefinitionContainer<Contracts.ApiClassDto> {
    constructor(extractedData: ExtractDto, apiItem: Contracts.ApiClassDto, reference: ApiItemReference) {
        super(extractedData, apiItem, reference);

        this.typeParameters = GeneratorHelpers
            .GetApiItemReferences(this.ExtractedData, apiItem.TypeParameters)
            .map(x => this.GetSerializedApiDefinition(x) as ApiTypeParameter);

        // Extends
        if (this.Data.Extends != null) {
            this.extends = GeneratorHelpers.SerializeApiType(this.ExtractedData, this.Data.Extends);
        }

        // Implements
        this.implements = this.Data.Implements
            .map(x => GeneratorHelpers.SerializeApiType(this.ExtractedData, x))
            .filter((x): x is ApiTypes => x != null);
    }

    private typeParameters: ApiTypeParameter[];

    public get TypeParameters(): ApiTypeParameter[] {
        return this.typeParameters;
    }

    private extends: ApiTypes | undefined;

    public get Extends(): ApiTypes | undefined {
        return this.extends;
    }

    private implements: ApiTypes[];

    public get Implements(): ApiTypes[] {
        return this.implements;
    }

    public ToText(): string[] {
        const name = this.Reference.Alias || this.Data.Name;

        // Abstract
        const abstract = this.Data.IsAbstract ? "abstract " : "";

        // TypeParameters
        const typeParameters: string = this.TypeParametersToString(this.TypeParameters);

        // Extends
        let extendsString: string;
        if (this.Extends != null) {
            extendsString = ` extends ${this.Extends.ToText().join(" ")}`;
        } else {
            extendsString = "";
        }

        // Implements
        let implementsString: string;
        if (this.Implements.length > 0) {
            const implementsList = this.Implements.map(x => this.SerializedTypeToString(x));

            implementsString = ` implements ${implementsList.join(", ")}`;
        } else {
            implementsString = "";
        }

        return [
            `${abstract}class ${name}${typeParameters}${extendsString}${implementsString}`
        ];
    }

    public ToHeadingText(): string {
        return this.Reference.Alias || this.Data.Name;
    }
}
