import { Contracts } from "ts-extractor";
import { MarkdownBuilder } from "@simplrjs/markdown";

import { SupportedApiItemKindType, PluginOptions, PluginResult } from "../contracts/plugin";
import { GeneratorHelpers } from "../generator-helpers";
import { FunctionLikePlugin } from "../abstractions/function-like-plugin";

export class ApiClassConstructorPlugin extends FunctionLikePlugin<Contracts.ApiClassConstructorDto> {
    public SupportedApiItemKinds(): SupportedApiItemKindType[] {
        return [GeneratorHelpers.ApiItemKinds.ClassConstructor];
    }

    public Render(options: PluginOptions<Contracts.ApiClassConstructorDto>): PluginResult {
        // ApiParameters
        const apiParameters = GeneratorHelpers
            .GetApiItemsFromReferenceList<Contracts.ApiParameterDto>(options.ExtractedData, options.ApiItem.Parameters);

        const heading = GeneratorHelpers.MethodToSimpleString("constructor", apiParameters);
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

        // Header
        pluginResult.Result = new MarkdownBuilder()
            .Header(heading, 3)
            .EmptyLine()
            .Text(GeneratorHelpers.RenderApiItemMetadata(options.ApiItem))
            .Code(GeneratorHelpers.ApiClassConstructorToString(
                options.ExtractedData,
                options.ApiItem,
                apiParameters
            ), GeneratorHelpers.DEFAULT_CODE_OPTIONS)
            .GetOutput();

        // Parameters
        const parametersResult = this.RenderParameters(options.ExtractedData, apiParameters);
        GeneratorHelpers.MergePluginResultData(pluginResult, parametersResult);

        return pluginResult;
    }
}
