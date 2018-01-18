import { Contracts } from "ts-extractor";

import { GeneratorHelpers } from "../../generator-helpers";
import { ApiEnumMember } from "./api-enum-member";
import { ApiDefinitionBase } from "../api-definition-base";
import { ApiItemReference } from "../../contracts/api-item-reference";

export class ApiEnum extends ApiDefinitionBase<Contracts.ApiEnumDto> {
    private enumMembers: ApiEnumMember[];

    public get EnumMembers(): ApiEnumMember[] {
        if (this.enumMembers == null) {
            this.enumMembers = GeneratorHelpers
                .GetApiItemReferences(this.ExtractedData, this.Data.Members)
                .map<[ApiItemReference, Contracts.ApiEnumMemberDto]>(reference =>
                    [reference, this.ExtractedData.Registry[reference.Id] as Contracts.ApiEnumMemberDto]
                )
                .map(([reference, enumMember]) => new ApiEnumMember(this.ExtractedData, enumMember, reference));
        }
        return this.enumMembers;
    }

    public ToText(alias?: string): string[] {
        const name = alias || this.Data.Name;
        const $const = this.Data.IsConst ? "const " : "";

        // Constructing enum body.
        const membersStrings = this.EnumMembers.map((memberItem, index, array) => {
            let memberString = `${GeneratorHelpers.Tab()} ${memberItem.ToText()}`;

            // Add a comma if current item is not the last item
            if (index !== this.EnumMembers.length - 1) {
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
