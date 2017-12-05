import { Contracts, ExtractDto } from "ts-extractor";
import { MarkdownGenerator } from "@simplrjs/markdown";

import { ApiItemPluginBase } from "../abstractions/api-item-plugin-base";
import { SupportedApiItemKindType } from "../contracts/supported-api-item-kind-type";
import { PluginData } from "../contracts/plugin-data";
import { RenderItemOutputDto } from "../contracts/render-item-output-dto";
import { ExtractorHelpers } from "../extractor-helpers";

// TODO: const enums implementation.
export class ApiEnumPlugin extends ApiItemPluginBase<Contracts.ApiEnumDto> {
    public SupportedApiItemsKinds(): SupportedApiItemKindType[] {
        return [this.SupportKind.Enum];
    }

    // TODO: implement @deprecated and @beta.
    private resolveDocumentationComment(metaData: Contracts.ApiMetadataDto): string[] {
        if (metaData.DocumentationComment.length === 0) {
            return [];
        }

        return metaData.DocumentationComment.map(commentItem => commentItem.text);
    }

    // TODO: move to extractor helpers.
    private reconstructEnumCode(alias: string, memberItems: Contracts.ApiEnumMemberDto[]): string[] {
        const membersStrings = memberItems.map((memberItem, index, array) => {
            let memberString = `${ExtractorHelpers.Tab()} ${memberItem.Name}`;

            if (memberItem.Value) {
                memberString += ` = ${memberItem.Value}`;
            }

            // Checking if current item is not the last item
            if (index !== memberItems.length - 1) {
                memberString += ",";
            }

            return memberString;
        });

        return [
            `enum ${alias} {`,
            ...membersStrings,
            "}"
        ];
    }

    private constructEnumTable(members: Contracts.ApiEnumMemberDto[]): string[] {
        const header = ["Name", "Value"];

        let descriptionFound = false;
        const content = members.map<string[]>(member => {
            const row: string[] = [member.Name, member.Value];
            const comments = member.Metadata.DocumentationComment;

            if (comments.length > 0) {
                descriptionFound = true;

                const commentSeparator = " ";
                let description = "";

                // TODO: add '.' if needed.
                comments.forEach((comment, index, array) => {
                    description += comment.text;

                    if (index !== array.length - 1) {
                        description += commentSeparator;
                    }
                });

                row.push(description);
            }

            return row;
        });

        if (descriptionFound) {
            header.push("Description");
        }

        return MarkdownGenerator.table(header, content);
    }

    private getEnumMembers(members: Contracts.ApiItemReferenceTuple, extractedData: ExtractDto): Contracts.ApiEnumMemberDto[] {
        const apiItems: Contracts.ApiEnumMemberDto[] = [];

        for (const memberReferences of members) {
            const [, references] = memberReferences;
            for (const reference of references) {
                const apiItem = extractedData.Registry[reference] as Contracts.ApiEnumMemberDto;
                apiItems.push(apiItem);
            }
        }

        return apiItems;
    }

    public Render(data: PluginData<Contracts.ApiEnumDto>): RenderItemOutputDto {
        const [, alias] = data.Reference;

        const heading = MarkdownGenerator.header(alias, 2);

        const enumMembers = this.getEnumMembers(data.ApiItem.Members, data.ExtractedData);

        // TODO: move MarkdownGenerator code option to helpers.
        const output: string[] = [
            heading,
            "",
            ...this.resolveDocumentationComment(data.ApiItem.Metadata),
            "",
            ...MarkdownGenerator.code(this.reconstructEnumCode(alias, enumMembers), { lang: "typescript" }),
            "",
            ...this.constructEnumTable(enumMembers)
        ];

        return {
            Heading: "Enum",
            ApiItem: data.ApiItem,
            References: [],
            RenderOutput: output
        };
    }
}
