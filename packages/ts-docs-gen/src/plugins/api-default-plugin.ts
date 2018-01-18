import { Contracts } from "ts-extractor";
import { MarkdownBuilder } from "@simplrjs/markdown";

import { PluginOptions, PluginResult, SupportedApiItemKindType } from "../contracts/plugin";
import { GeneratorHelpers } from "../generator-helpers";
import { BasePlugin } from "../abstractions/base-plugin";
import { ApiDefinitionDefault } from "../api-items/api-definition-default";

export class ApiDefaultPlugin extends BasePlugin {
    public SupportedApiItemKinds(): SupportedApiItemKindType[] {
        return [GeneratorHelpers.ApiItemKinds.Any];
    }

    public Render(options: PluginOptions, apiItem: Contracts.ApiItemDto): PluginResult {
        const serializedApiItem = new ApiDefinitionDefault(options.ExtractedData, apiItem, options.Reference);

        const heading = serializedApiItem.ToHeadingText();
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
            .Bold(`Warning: unsupported api item kind ${apiItem.ApiKind}!`)
            .EmptyLine()
            .Text(GeneratorHelpers.RenderApiItemMetadata(apiItem))
            .GetOutput();

        return pluginResult;
    }
}
