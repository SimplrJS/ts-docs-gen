import { Contracts, ExtractDto } from "ts-extractor";
import { GeneratorHelpers } from "../../generator-helpers";
import { ApiDefinitionContainer } from "../api-definition-container";
import { ApiItemReference } from "../../contracts/api-item-reference";
import { ApiTypes } from "../api-type-list";
import { ApiTypeParameter } from "./api-type-parameter";

export class ApiInterface extends ApiDefinitionContainer<Contracts.ApiInterfaceDto> {
    constructor(extractedData: ExtractDto, apiItem: Contracts.ApiInterfaceDto, reference: ApiItemReference) {
        super(extractedData, apiItem, reference);

        this.typeParameters = GeneratorHelpers
            .GetApiItemReferences(this.ExtractedData, apiItem.TypeParameters)
            .map(x => this.GetSerializedApiDefinition(x) as ApiTypeParameter);

        this.extends = this.Data.Extends
            .map(x => GeneratorHelpers.SerializeApiType(this.ExtractedData, x))
            .filter((x): x is ApiTypes => x != null);
    }

    private typeParameters: ApiTypeParameter[];

    public get TypeParameters(): ApiTypeParameter[] {
        return this.typeParameters;
    }

    private extends: ApiTypes[];

    public get Extends(): ApiTypes[] {
        return this.extends;
    }

    public ToText(): string[] {
        const name = this.Reference.Alias || this.Data.Name;

        // TypeParameters
        const typeParameters: string = this.TypeParametersToString(this.TypeParameters);

        // Extends
        let extendsString: string;
        if (this.Data.Extends != null && this.Data.Extends.length > 0) {
            const typesList = this.Extends.map(x => this.SerializedTypeToString(x));

            extendsString = ` extends ${typesList.join(", ")}`;
        } else {
            extendsString = "";
        }

        // Members
        const members = this.MembersToText(this.Members, 1);

        return [
            `interface ${name}${typeParameters}${extendsString} {`,
            ...members,
            `}`
        ];
    }

    public ToHeadingText(alias?: string | undefined): string {
        return this.Reference.Alias || this.Data.Name;
    }
}
