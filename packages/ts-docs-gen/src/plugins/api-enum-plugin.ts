import { Contracts } from "ts-extractor";
import { MarkdownGenerator, MarkdownBuilder } from "@simplrjs/markdown";

import { GeneratorHelpers } from "../generator-helpers";
import { SupportedApiItemKindType, PluginResult, PluginOptions } from "../contracts/plugin";
import { BasePlugin } from "../abstractions/base-plugin";
import { ApiEnum } from "../api-items/definitions/api-enum";
import { ApiEnumMember } from "../api-items/definitions/api-enum-member";

export class ApiEnumPlugin extends BasePlugin<Contracts.ApiEnumDto> {
    public SupportedApiItemKinds(): SupportedApiItemKindType[] {
        return [GeneratorHelpers.ApiItemKinds.Enum];
    }

    public CheckApiItem(item: Contracts.ApiEnumDto): boolean {
        return true;
    }

    private renderEnumTable(members: ApiEnumMember[]): string[] {
        // Table header.
        const header = ["Name", "Value", "Description"];
        const content = members.map(x => [x.Data.Name, x.Data.Value, x.Data.Metadata.DocumentationComment]);

        return MarkdownGenerator.Table(header, content, { removeColumnIfEmpty: true });
    }

    public Render(options: PluginOptions, apiItem: Contracts.ApiEnumDto): PluginResult {
        const serializedApiItem = new ApiEnum(options.ExtractedData, apiItem, options.Reference);

        const heading: string = serializedApiItem.ToHeadingText();
        const pluginResult: PluginResult = {
            ...GeneratorHelpers.GetDefaultPluginResultData(),
            ApiItem: apiItem,
            Reference: options.Reference,
            Headings: [
                {
                    Heading: heading,
                    ApiItemId: options.Reference.Id
                }
            ],
            UsedReferences: [options.Reference.Id]
        };


        pluginResult.Result = new MarkdownBuilder()
            .Header(heading, 3)
            .EmptyLine()
            .Text(this.RenderApiItemMetadata(apiItem))
            .EmptyLine()
            .Code(serializedApiItem.ToText(), GeneratorHelpers.DEFAULT_CODE_OPTIONS)
            .EmptyLine()
            .Bold("Members")
            .EmptyLine()
            .Text(this.renderEnumTable(serializedApiItem.EnumMembers))
            .GetOutput();

        return pluginResult;
    }
}
