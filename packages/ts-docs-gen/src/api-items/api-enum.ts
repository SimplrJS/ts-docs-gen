import { Contracts } from "ts-extractor";

import { BaseApiItem } from "../abstractions/base-api-item";
import { ApiEnumMember } from "./api-enum-member";
import { GeneratorHelpers } from "../generator-helpers";

export class ApiEnum extends BaseApiItem<Contracts.ApiEnumDto> {
    private getEnumMembers(): ApiEnumMember[] {
        return GeneratorHelpers
            .GetApiItemsFromReference<Contracts.ApiEnumMemberDto>(this.ExtractedData, this.Data.Members)
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
        return this.Data.Name;
    }
}
