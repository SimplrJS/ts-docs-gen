import { Contracts, ExtractDto } from "ts-extractor";

import { GeneratorHelpers } from "../../generator-helpers";
import { ApiEnumMember } from "./api-enum-member";
import { ApiDefinitionBase } from "../api-definition-base";
import { ApiItemReference } from "../../contracts/api-item-reference";

export class ApiEnum extends ApiDefinitionBase<Contracts.ApiEnumDto> {
    constructor(extractedData: ExtractDto, apiItem: Contracts.ApiEnumDto, reference: ApiItemReference) {
        super(extractedData, apiItem, reference);

        this.enumMembers = this.getEnumMembers();
    }

    private enumMembers: ApiEnumMember[];

    public get EnumMembers(): ApiEnumMember[] {
        return this.enumMembers;
    }

    private getEnumMembers(): ApiEnumMember[] {
        return GeneratorHelpers
            .GetApiItemsFromReferenceList<Contracts.ApiEnumMemberDto>(this.ExtractedData, this.Data.Members)
            .map(x => new ApiEnumMember(this.ExtractedData, x));
    }

    public ToText(alias?: string): string[] {
        const enumMembers = this.getEnumMembers();

        const name = alias || this.Data.Name;
        const $const = this.Data.IsConst ? "const " : "";

        // Constructing enum body.
        const membersStrings = enumMembers.map((memberItem, index, array) => {
            let memberString = `${GeneratorHelpers.Tab()} ${memberItem.ToText()}`;

            // Add a comma if current item is not the last item
            if (index !== enumMembers.length - 1) {
                memberString += ",";
            }

            return memberString;
        });

        // Construct enum code output
        return [
            `${$const}enum ${name} {`,
            ...membersStrings,
            "}"
        ];
    }

    public ToHeadingText(): string {
        return this.Reference.Alias || this.Data.Name;
    }
}
