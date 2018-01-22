import { Contracts } from "ts-extractor";
import { MarkdownBuilder, MarkdownGenerator as md } from "@simplrjs/markdown";

import { SupportedApiItemKindType, PluginResult, PluginOptions } from "../contracts/plugin";
import { GeneratorHelpers } from "../generator-helpers";
import { BasePlugin } from "../abstractions/base-plugin";
import { ApiIndex } from "../api-items/definitions/api-index";

export class ApiIndexPlugin extends BasePlugin<Contracts.ApiIndexDto> {
    public SupportedApiItemKinds(): SupportedApiItemKindType[] {
        return [GeneratorHelpers.ApiItemKinds.Index];
    }

    public Render(options: PluginOptions, apiItem: Contracts.ApiIndexDto): PluginResult<Contracts.ApiIndexDto> {
        const serializedApiItem = new ApiIndex(options.ExtractedData, apiItem, options.Reference);

        const pluginResult: PluginResult<Contracts.ApiIndexDto> = {
            ...GeneratorHelpers.GetDefaultPluginResultData(),
            ApiItem: apiItem,
            Reference: options.Reference
        };

        const parameter = serializedApiItem.Parameter;

        // Types
        const parameterTypeString = parameter.Type
            .ToInlineText(this.RenderReferences(options.ExtractedData, pluginResult.UsedReferences));
        const typeString = serializedApiItem.Type
            .ToInlineText(this.RenderReferences(options.ExtractedData, pluginResult.UsedReferences));

        pluginResult.Result = new MarkdownBuilder()
            .Code(serializedApiItem.ToText(), GeneratorHelpers.DEFAULT_CODE_OPTIONS)
            .EmptyLine()
            .UnorderedList([
                `${md.Italic("Parameter")} ${md.InlineCode(parameter.Name)} - ${parameterTypeString}`,
                `${md.Italic("Type")} ${typeString}`
            ])
            .GetOutput();

        return pluginResult;
    }
}
