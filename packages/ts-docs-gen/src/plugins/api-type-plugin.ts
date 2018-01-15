import { Contracts } from "ts-extractor";
import { MarkdownBuilder } from "@simplrjs/markdown";

import { GeneratorHelpers } from "../generator-helpers";
import { SupportedApiItemKindType, PluginOptions, PluginResult } from "../contracts/plugin";
import { BasePlugin } from "../abstractions/base-plugin";

export class ApiTypePlugin extends BasePlugin<Contracts.ApiTypeAliasDto> {
    public SupportedApiItemKinds(): SupportedApiItemKindType[] {
        return [GeneratorHelpers.ApiItemKinds.TypeAlias];
    }

    public Render(options: PluginOptions<Contracts.ApiTypeAliasDto>): PluginResult {
        const heading = options.Reference.Alias;
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

        const codeInline = GeneratorHelpers.ApiTypeAliasToString(options.ExtractedData, options.Reference.Alias, options.ApiItem.Type);

        // Header
        pluginResult.Result = new MarkdownBuilder()
            .Header(heading, 3)
            .EmptyLine()
            .Text(GeneratorHelpers.RenderApiItemMetadata(options.ApiItem))
            .Code(codeInline, GeneratorHelpers.DEFAULT_CODE_OPTIONS)
            .GetOutput();

        // TypeParameters
        const apiTypeParameters = GeneratorHelpers
            .GetApiItemsFromReference<Contracts.ApiTypeParameterDto>(options.ExtractedData, options.ApiItem.TypeParameters);
        const typeParametersResult = this.RenderTypeParameters(options.ExtractedData, apiTypeParameters);
        GeneratorHelpers.MergePluginResultData(pluginResult, typeParametersResult);

        // Type
        const typeResult = this.RenderType(options.ExtractedData, options.ApiItem.Type);
        GeneratorHelpers.MergePluginResultData(pluginResult, typeResult);

        return pluginResult;
    }
}
