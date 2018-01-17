import { Contracts, ExtractDto } from "ts-extractor";
import { GeneratorHelpers } from "../../generator-helpers";
import { ApiDefinitionBase } from "../api-definition-base";
import { SerializedApiType, SerializedApiDefinition } from "../../contracts/serialized-api-item";

export class ApiInterface extends ApiDefinitionBase<Contracts.ApiInterfaceDto> {
    constructor(extractedData: ExtractDto, apiItem: Contracts.ApiInterfaceDto) {
        super(extractedData, apiItem);

        this.extends = this.Data.Extends
            .map(x => GeneratorHelpers.SerializeApiType(this.ExtractedData, x))
            .filter((x): x is SerializedApiType => x != null);

        this.members = this.GetMembers(this.Data.Members);
    }

    private extends: SerializedApiType[];

    public get Extends(): SerializedApiType[] {
        return this.extends;
    }

    private members: SerializedApiDefinition[];

    public get Members(): SerializedApiDefinition[] {
        return this.members;
    }

    public ToText(alias?: string | undefined): string[] {
        const name = alias || this.Data.Name;

        // TypeParameters
        const typeParameters: string = this.TypeParametersToString(this.Data);

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
        return alias || this.Data.Name;
    }
}
