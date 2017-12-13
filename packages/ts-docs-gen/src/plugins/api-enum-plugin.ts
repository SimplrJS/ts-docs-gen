import { Contracts, ExtractDto } from "ts-extractor";
import { MarkdownGenerator, MarkdownBuilder } from "@simplrjs/markdown";

import { GeneratorHelpers } from "../generator-helpers";
import { Plugin, SupportedApiItemKindType, PluginResult, PluginOptions, PluginHeading } from "../contracts/plugin";

// TODO: const enums implementation.
export class ApiEnumPlugin implements Plugin<Contracts.ApiEnumDto> {
    public SupportedApiItemKinds(): SupportedApiItemKindType[] {
        return [GeneratorHelpers.ApiItemKinds.Enum];
    }

    public CheckApiItem(item: Contracts.ApiItemDto): boolean {
        return true;
    }

    private constructEnumTable(members: Contracts.ApiEnumMemberDto[]): string[] {
        // Table header.
        const header = ["Name", "Value", "Description"];
        const content = members.map(x => [x.Name, x.Value, x.Metadata.DocumentationComment]);

        return MarkdownGenerator.Table(header, content, { removeColumnIfEmpty: true });
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

    public Render(data: PluginOptions<Contracts.ApiEnumDto>): PluginResult {
        const heading: string = data.Reference.Alias;
        const headings: PluginHeading[] = [
            {
                ApiItemId: data.Reference.Id,
                Heading: heading
            }
        ];

        const enumMembers = this.getEnumMembers(data.ApiItem.Members, data.ExtractedData);
        const builder = new MarkdownBuilder()
            .Header(heading, 2)
            .EmptyLine()
            .Text(GeneratorHelpers.RenderApiItemMetadata(data.ApiItem))
            .EmptyLine()
            .Code(GeneratorHelpers.ReconstructEnumCode(data.Reference.Alias, enumMembers), GeneratorHelpers.DEFAULT_CODE_OPTIONS)
            .EmptyLine()
            .Text(this.constructEnumTable(enumMembers));

        return {
            ApiItem: data.ApiItem,
            Reference: data.Reference,
            Headings: headings,
            UsedReferences: [],
            Result: builder.GetOutput()
        };
    }
}
