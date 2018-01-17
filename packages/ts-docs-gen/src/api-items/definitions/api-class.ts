import { Contracts, ExtractDto } from "ts-extractor";
import { ApiDefinitionBase } from "../api-definition-base";
import { GeneratorHelpers } from "../../generator-helpers";
import { SerializedApiType, SerializedApiDefinition } from "../../contracts/serialized-api-item";

export class ApiClass extends ApiDefinitionBase<Contracts.ApiClassDto> {
    constructor(extractedData: ExtractDto, apiItem: Contracts.ApiClassDto) {
        super(extractedData, apiItem);

        if (this.Data.Extends != null) {
            this.extends = GeneratorHelpers.SerializeApiType(this.ExtractedData, this.Data.Extends);
        }
        this.implements = this.Data.Implements
            .map(x => GeneratorHelpers.SerializeApiType(this.ExtractedData, x))
            .filter((x): x is SerializedApiType<Contracts.ApiType> => x != null);

        this.members = this.GetMembers(this.Data.Members);
    }

    private extends: SerializedApiType | undefined;

    public get Extends(): SerializedApiType | undefined {
        return this.extends;
    }

    private implements: SerializedApiType[];

    public get Implements(): SerializedApiType[] {
        return this.implements;
    }

    private members: Array<SerializedApiDefinition<Contracts.ApiItemDto>>;

    public get Members(): Array<SerializedApiDefinition<Contracts.ApiItemDto>> {
        return this.members;
    }

    public ToText(alias?: string | undefined): string[] {
        const name = alias || this.Data.Name;

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

    public ToHeadingText(alias?: string | undefined): string {
        return alias || this.Data.Name;
    }
}
