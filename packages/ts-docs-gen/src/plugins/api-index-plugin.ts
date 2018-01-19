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
        const type = serializedApiItem.Type;

        pluginResult.Result = new MarkdownBuilder()
            .Code(serializedApiItem.ToText(), GeneratorHelpers.DEFAULT_CODE_OPTIONS)
            .EmptyLine()
            .UnorderedList([
                `${md.Italic("Parameter")} ${md.InlineCode(parameter.Name)} - ${parameter.Type.ToInlineText()}`,
                `${md.Italic("Type")} ${type.ToInlineText()}`
            ])
            .GetOutput();

        return pluginResult;
    }
}
