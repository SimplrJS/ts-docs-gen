import { Contracts } from "ts-extractor";
import { MarkdownBuilder } from "@simplrjs/markdown";

import { SupportedApiItemKindType, PluginResult, PluginOptions } from "../contracts/plugin";
import { GeneratorHelpers } from "../generator-helpers";
import { BasePlugin } from "../abstractions/base-plugin";

export class ApiIndexPlugin extends BasePlugin<Contracts.ApiIndexDto> {
    public SupportedApiItemKinds(): SupportedApiItemKindType[] {
        return [GeneratorHelpers.ApiItemKinds.Index];
    }

    public Render(options: PluginOptions<Contracts.ApiIndexDto>): PluginResult<Contracts.ApiIndexDto> {
        const pluginResult: PluginResult<Contracts.ApiIndexDto> = {
            ...GeneratorHelpers.GetDefaultPluginResultData(),
            ApiItem: options.ApiItem,
            Reference: options.Reference
        };
        // Parameter
        const parameter = options.ExtractedData.Registry[options.ApiItem.Parameter] as Contracts.ApiParameterDto;

        // Types
        const parameterType = GeneratorHelpers.TypeDtoToMarkdownString(parameter.Type);
        const indexType = GeneratorHelpers.TypeDtoToMarkdownString(options.ApiItem.Type);
        GeneratorHelpers.MergePluginResultData(pluginResult, {
            UsedReferences: [
                ...parameterType.References,
                ...indexType.References
            ]
        });

        // Header
        const indexDeclarationString = GeneratorHelpers.ApiIndexToString(parameter, options.ApiItem.Type, options.ApiItem.IsReadonly);
        const builder = new MarkdownBuilder()
            .Code(indexDeclarationString, GeneratorHelpers.DEFAULT_CODE_OPTIONS)
            .EmptyLine();

        // !!! @DeividasBakanas, should we really include this?
        // Readonly
        // if (options.ApiItem.IsReadonly) {
        //     builder
        //         .Italic("Readonly")
        //         .EmptyLine();
        // }

        pluginResult.Result = builder
            .Text(md => `${md.Bold("Index")} ${md.InlineCode(parameter.Name)} - ${parameterType.Text}`)
            .EmptyLine()
            .Text(md => `${md.Bold("Type")} - ${indexType.Text}`)
            .GetOutput();


        return pluginResult;
    }
}
