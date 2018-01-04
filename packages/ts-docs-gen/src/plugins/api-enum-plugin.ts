import { Contracts } from "ts-extractor";
import { MarkdownGenerator, MarkdownBuilder } from "@simplrjs/markdown";

import { GeneratorHelpers } from "../generator-helpers";
import { SupportedApiItemKindType, PluginResult, PluginOptions } from "../contracts/plugin";
import { BasePlugin } from "../abstractions/base-plugin";

export class ApiEnumPlugin extends BasePlugin<Contracts.ApiEnumDto> {
    public SupportedApiItemKinds(): SupportedApiItemKindType[] {
        return [GeneratorHelpers.ApiItemKinds.Enum];
    }

    public CheckApiItem(item: Contracts.ApiItemDto): boolean {
        return true;
    }

    private renderEnumTable(members: Contracts.ApiEnumMemberDto[]): string[] {
        // Table header.
        const header = ["Name", "Value", "Description"];
        const content = members.map(x => [x.Name, x.Value, x.Metadata.DocumentationComment]);

        return MarkdownGenerator.Table(header, content, { removeColumnIfEmpty: true });
    }

    public Render(options: PluginOptions<Contracts.ApiEnumDto>): PluginResult {
        const heading: string = options.Reference.Alias;
        const pluginResult: PluginResult = {
            ...GeneratorHelpers.GetDefaultPluginResultData(),
            ApiItem: options.ApiItem,
            Reference: options.Reference,
            Headings: [
                {
                    Heading: heading,
                    ApiItemId: options.Reference.Id
                }
            ]
        };

        // Enum members
        const enumMembers = GeneratorHelpers.GetApiItemsFromReference<Contracts.ApiEnumMemberDto>(
            options.ApiItem.Members,
            options.ExtractedData
        );

        pluginResult.Result = new MarkdownBuilder()
            .Header(heading, 3)
            .EmptyLine()
            .Text(GeneratorHelpers.RenderApiItemMetadata(options.ApiItem))
            .EmptyLine()
            .Code(GeneratorHelpers.ApiEnumToString(
                options.ApiItem,
                enumMembers,
                options.Reference.Alias
            ), GeneratorHelpers.DEFAULT_CODE_OPTIONS)
            .EmptyLine()
            .Bold("Members")
            .EmptyLine()
            .Text(this.renderEnumTable(enumMembers))
            .GetOutput();

        return pluginResult;
    }
}
