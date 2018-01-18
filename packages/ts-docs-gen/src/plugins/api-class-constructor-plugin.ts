import { Contracts } from "ts-extractor";
import { MarkdownBuilder } from "@simplrjs/markdown";

import { SupportedApiItemKindType, PluginOptions, PluginResult } from "../contracts/plugin";
import { GeneratorHelpers } from "../generator-helpers";
import { FunctionLikePlugin } from "../abstractions/function-like-plugin";
import { ApiClassConstructor } from "../api-items/definitions/api-class-constructor";

export class ApiClassConstructorPlugin extends FunctionLikePlugin<Contracts.ApiClassConstructorDto> {
    public SupportedApiItemKinds(): SupportedApiItemKindType[] {
        return [GeneratorHelpers.ApiItemKinds.ClassConstructor];
    }

    public Render(options: PluginOptions, apiItem: Contracts.ApiClassConstructorDto): PluginResult {
        const serializedApiItem = new ApiClassConstructor(options.ExtractedData, apiItem, options.Reference);

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

        // Header
        pluginResult.Result = new MarkdownBuilder()
            .Header(heading, 3)
            .EmptyLine()
            .Text(this.RenderApiItemMetadata(apiItem))
            .Code(serializedApiItem.ToText(), GeneratorHelpers.DEFAULT_CODE_OPTIONS)
            .GetOutput();

        // Parameters
        const parametersResult = this.RenderParameters(serializedApiItem.Parameters);
        GeneratorHelpers.MergePluginResultData(pluginResult, parametersResult);

        return pluginResult;
    }
}
