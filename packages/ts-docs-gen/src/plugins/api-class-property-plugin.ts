import { Contracts } from "ts-extractor";
import { MarkdownBuilder } from "@simplrjs/markdown";

import { SupportedApiItemKindType, PluginOptions, PluginResult } from "../contracts/plugin";
import { GeneratorHelpers } from "../generator-helpers";
import { BasePlugin } from "../abstractions/base-plugin";

export class ApiClassPropertyPlugin extends BasePlugin<Contracts.ApiClassPropertyDto> {
    public SupportedApiItemKinds(): SupportedApiItemKindType[] {
        return [GeneratorHelpers.ApiItemKinds.ClassProperty];
    }

    public Render(options: PluginOptions<Contracts.ApiClassPropertyDto>): PluginResult {
        const heading = options.Reference.Alias;
        const pluginResult: PluginResult = {
            ...GeneratorHelpers.GetDefaultPluginResultData(),
            ApiItem: options.ApiItem,
            Reference: options.Reference,
            Headings: [
                {
                    ApiItemId: options.Reference.Id,
                    Heading: heading
                }
            ],
            UsedReferences: [options.Reference.Id]
        };

        // Header
        pluginResult.Result = new MarkdownBuilder()
            .Header(heading, 3)
            .EmptyLine()
            .Text(GeneratorHelpers.RenderApiItemMetadata(options.ApiItem))
            .Code(GeneratorHelpers.ApiClassPropertyToString(
                options.ApiItem,
                options.Reference.Alias
            ), GeneratorHelpers.DEFAULT_CODE_OPTIONS)
            .GetOutput();

        const typeResult = this.RenderType(options.ApiItem.Type);
        GeneratorHelpers.MergePluginResultData(pluginResult, typeResult);

        return pluginResult;
    }
}
