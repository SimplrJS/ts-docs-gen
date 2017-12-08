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

    private resolveDocumentationComment(metaData: Contracts.ApiMetadataDto): string {
        if (metaData.DocumentationComment.length === 0) {
            return "";
        }

        // TODO: implement ExtractorHelpers.FixSentence when comments separation implemented in `ts-extractor`.
        return metaData.DocumentationComment;
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
        const header = ["Name", "Value", "Description"];
        const content = members.map(x => [x.Name, x.Value, x.Metadata.DocumentationComment]);

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
