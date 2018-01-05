import { Contracts } from "ts-extractor";
import { MarkdownBuilder } from "@simplrjs/markdown";

import { PluginOptions, PluginResult, SupportedApiItemKindType } from "../contracts/plugin";
import { GeneratorHelpers } from "../generator-helpers";
import { BasePlugin } from "../abstractions/base-plugin";

export class ApiDefaultPlugin extends BasePlugin<Contracts.ApiItemDto> {
    public SupportedApiItemKinds(): SupportedApiItemKindType[] {
        return [GeneratorHelpers.ApiItemKinds.Any];
    }

    public Render(options: PluginOptions<Contracts.ApiItemDto>): PluginResult {
        const heading = `${options.ApiItem.ApiKind}: ${options.Reference.Alias}`;
        const pluginResult: PluginResult = {
            ...GeneratorHelpers.GetDefaultPluginResultData(),
            ApiItem: options.ApiItem,
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
            .Bold(`Warning: unsupported api item kind ${options.ApiItem.ApiKind}!`)
            .EmptyLine()
            .Text(GeneratorHelpers.RenderApiItemMetadata(options.ApiItem))
            .GetOutput();

        return pluginResult;
    }
}
