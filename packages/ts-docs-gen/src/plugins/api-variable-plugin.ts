import { Contracts } from "ts-extractor";
import { MarkdownBuilder } from "@simplrjs/markdown";

import { GeneratorHelpers } from "../generator-helpers";
import { SupportedApiItemKindType, PluginOptions, PluginResult } from "../contracts/plugin";
import { BasePlugin } from "../abstractions/base-plugin";
import { ApiVariable } from "../api-items/definitions/api-variable";

export class ApiVariablePlugin extends BasePlugin<Contracts.ApiVariableDto> {
    public SupportedApiItemKinds(): SupportedApiItemKindType[] {
        return [GeneratorHelpers.ApiItemKinds.Variable];
    }

    public Render(options: PluginOptions, apiItem: Contracts.ApiVariableDto): PluginResult {
        const serializedApiItem = new ApiVariable(options.ExtractedData, apiItem, options.Reference);

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
            .Text(GeneratorHelpers.RenderApiItemMetadata(apiItem))
            .Code(serializedApiItem.ToText(), GeneratorHelpers.DEFAULT_CODE_OPTIONS)
            .EmptyLine()
            .Bold("Type")
            .EmptyLine()
            .Text(serializedApiItem.ToText().join(" "))
            .GetOutput();

        return pluginResult;
    }
}
