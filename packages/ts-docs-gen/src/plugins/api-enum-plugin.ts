import { Contracts, ExtractDto } from "ts-extractor";
import { MarkdownGenerator, MarkdownBuilder } from "@simplrjs/markdown";

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

    private resolveDocumentationComment(metaData: Contracts.ApiMetadataDto): string[] {
        if (metaData.DocumentationComment.length === 0) {
            return [];
        }

        // TODO: implement ExtractorHelpers.FixSentence when comments separation implemented in `ts-extractor`.
        return metaData.DocumentationComment.map(commentItem => commentItem.text);
    }

    // TODO: improve output text of @beta and @deprecated JSDocTags.
    /**
     * Resolves "@beta" and "@deprecated" JSDocTags.
     */
    private resolveJSDocTags(metaData: Contracts.ApiMetadataDto): string[] {
        return metaData.JSDocTags
            .filter(tag => tag.name === "deprecated" || tag.name === "beta")
            .map<string>(tag => {
                if (tag.text) {
                    return `${tag.name} - ${tag.text}`;
                }

                return tag.name;
            });
    }

    private constructEnumTable(members: Contracts.ApiEnumMemberDto[]): string[] {
        // Table header.
        const header = ["Name", "Value"];

        // Assuming that enum members are not described separately.
        let descriptionFound = false;

        // Generating table content.
        const content = members.map<string[]>(member => {
            const row: string[] = [member.Name, member.Value];
            const comments = member.Metadata.DocumentationComment;

            // Handling enum member comments.
            if (comments.length > 0) {
                descriptionFound = true;

                const commentSeparator = " ";
                let description = "";

                // Reducing comments into a single description.
                comments.forEach((comment, index, array) => {
                    description += ExtractorHelpers.FixSentence(comment.text);

                    if (index !== array.length - 1) {
                        description += commentSeparator;
                    }
                });

                row.push(description);
            }

            return row;
        });

        // Add description cell in header if at least one enum member have comment.
        if (descriptionFound) {
            header.push("Description");
        }

        return MarkdownGenerator.Table(header, content);
    }

    /**
     * Resolve api items of an enum from ApiItemReferenceTuple.
     */
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
        const enumMembers = this.getEnumMembers(data.ApiItem.Members, data.ExtractedData);
        const builder = new MarkdownBuilder()
            .Header(alias, 2)
            .EmptyLine()
            .Text(this.resolveDocumentationComment(data.ApiItem.Metadata))
            .EmptyLine()
            .Text(this.resolveJSDocTags(data.ApiItem.Metadata))
            .EmptyLine()
            .Code(ExtractorHelpers.ReconstructEnumCode(alias, enumMembers), ExtractorHelpers.DEFAULT_CODE_OPTIONS)
            .EmptyLine()
            .Text(this.constructEnumTable(enumMembers));

        return {
            Heading: "Enum",
            ApiItem: data.ApiItem,
            References: [],
            RenderOutput: builder.GetOutput()
        };
    }
}
