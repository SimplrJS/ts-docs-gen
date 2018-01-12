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

        const codeInline = GeneratorHelpers.ApiTypeAliasToString(options.Reference.Alias, options.ApiItem.Type, options.ExtractedData);

        // Header
        pluginResult.Result = new MarkdownBuilder()
            .Header(heading, 3)
            .EmptyLine()
            .Text(GeneratorHelpers.RenderApiItemMetadata(options.ApiItem))
            .Code(codeInline, GeneratorHelpers.DEFAULT_CODE_OPTIONS)
            .EmptyLine()
            .Text(GeneratorHelpers.ApiTypeToString(options.ApiItem.Type, options.ExtractedData))
            .GetOutput();

        // TypeParameters
        const apiTypeParameters = GeneratorHelpers
            .GetApiItemsFromReference<Contracts.ApiTypeParameterDto>(options.ApiItem.TypeParameters, options.ExtractedData);
        const typeParametersResult = this.RenderTypeParameters(apiTypeParameters, options.ExtractedData);
        GeneratorHelpers.MergePluginResultData(pluginResult, typeParametersResult);

        // FIXME:
        // // Type
        // const typeResult = this.RenderType(options.ApiItem.Type);
        // GeneratorHelpers.MergePluginResultData(pluginResult, typeResult);

        return pluginResult;
    }
}
