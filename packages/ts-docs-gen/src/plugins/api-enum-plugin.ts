import { Contracts } from "ts-extractor";
import { MarkdownGenerator, MarkdownBuilder } from "@simplrjs/markdown";

import { ApiItemPluginBase } from "../abstractions/api-item-plugin-base";
import { SupportedApiItemKindType } from "../contracts/supported-api-item-kind-type";
import { PluginData } from "../contracts/plugin-data";
import { RenderItemOutputDto } from "../contracts/render-item-output-dto";
import { ExtractorHelpers } from "../extractor-helpers";
import { GeneratorHelpers } from "../generator-helpers";

// TODO: const enums implementation.
// TODO: add summary jsdoc support.
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

    public Render(data: PluginData<Contracts.ApiEnumDto>): RenderItemOutputDto {
        const [, alias] = data.Reference;
        const enumMembers = ExtractorHelpers.GetApiItemsFromReferenceTuple<Contracts.ApiEnumMemberDto>(
            data.ApiItem.Members,
            data.ExtractedData
        );
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
