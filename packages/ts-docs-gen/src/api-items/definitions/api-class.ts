import { Contracts, ExtractDto } from "ts-extractor";
import { ApiDefinitionBase } from "../api-definition-base";
import { GeneratorHelpers } from "../../generator-helpers";
import { SerializedApiType } from "../../contracts/serialized-api-item";
import { ApiItemReference } from "../../contracts/api-item-reference";

export class ApiClass extends ApiDefinitionBase<Contracts.ApiClassDto> {
    constructor(extractedData: ExtractDto, apiItem: Contracts.ApiClassDto, reference: ApiItemReference) {
        super(extractedData, apiItem, reference);

        if (this.Data.Extends != null) {
            this.extends = GeneratorHelpers.SerializeApiType(this.ExtractedData, this.Data.Extends);
        }
        this.implements = this.Data.Implements
            .map(x => GeneratorHelpers.SerializeApiType(this.ExtractedData, x))
            .filter((x): x is SerializedApiType<Contracts.ApiType> => x != null);
    }

    private extends: SerializedApiType | undefined;

    public get Extends(): SerializedApiType | undefined {
        return this.extends;
    }

    private implements: SerializedApiType[];

    public get Implements(): SerializedApiType[] {
        return this.implements;
    }

    public ToText(): string[] {
        const name = this.Reference.Alias || this.Data.Name;

        // Abstract
        const abstract = this.Data.IsAbstract ? "abstract " : "";

        // TypeParameters
        const typeParameters: string = this.TypeParametersToString(this.Data);

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
