import { Contracts, ExtractDto } from "ts-extractor";
import { MarkdownGenerator, MarkdownBuilder } from "@simplrjs/markdown";

import { ApiItemPluginBase } from "../abstractions/api-item-plugin-base";
import { SupportedApiItemKindType } from "../contracts/supported-api-item-kind-type";
import { PluginData } from "../contracts/plugin-data";
import { RenderItemOutputDto } from "../contracts/render-item-output-dto";
import { ExtractorHelpers } from "../extractor-helpers";
import { GeneratorHelpers } from "../generator-helpers";

// TODO: const enums implementation.
export class ApiEnumPlugin extends ApiItemPluginBase<Contracts.ApiEnumDto> {
    public SupportedApiItemsKinds(): SupportedApiItemKindType[] {
        return [this.SupportKind.Enum];
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

    public Render(data: PluginData<Contracts.ApiEnumDto>): RenderItemOutputDto {
        const [, alias] = data.Reference;
        const enumMembers = this.getEnumMembers(data.ApiItem.Members, data.ExtractedData);
        const builder = new MarkdownBuilder()
            .Header(alias, 2)
            .EmptyLine()
            .Text(GeneratorHelpers.RenderApiItemMetadata(data.ApiItem))
            .EmptyLine()
            .Code(ExtractorHelpers.ReconstructEnumCode(alias, enumMembers), ExtractorHelpers.DEFAULT_CODE_OPTIONS)
            .EmptyLine()
            .Text(this.constructEnumTable(enumMembers));

        return {
            Heading: alias,
            ApiItem: data.ApiItem,
            References: [],
            RenderOutput: builder.GetOutput()
        };
    }
}
