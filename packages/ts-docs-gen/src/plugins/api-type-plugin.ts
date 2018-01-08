import { Contracts } from "ts-extractor";
import { MarkdownBuilder } from "@simplrjs/markdown";

import { GeneratorHelpers } from "../generator-helpers";
import { SupportedApiItemKindType, PluginOptions, PluginResult } from "../contracts/plugin";
import { BasePlugin } from "../abstractions/base-plugin";

export class ApiTypePlugin extends BasePlugin<Contracts.ApiTypeDto> {
    public SupportedApiItemKinds(): SupportedApiItemKindType[] {
        return [GeneratorHelpers.ApiItemKinds.Type];
    }

    private resolveTypeDto(options: PluginOptions<Contracts.ApiTypeDto>): Contracts.TypeDto {
        const resultType: Contracts.TypeDto = { ...options.ApiItem.Type };

        // Remove reference to itself.
        if (resultType.ReferenceId === options.Reference.Id) {
            resultType.ReferenceId = undefined;
        }

        return resultType;
    }

    public Render(options: PluginOptions<Contracts.ApiTypeDto>): PluginResult {
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

        const resolvedType = this.resolveTypeDto(options);
        const codeInline = GeneratorHelpers.ApiTypeToString(options.Reference.Alias, resolvedType, options.ExtractedData);

        // Header
        pluginResult.Result = new MarkdownBuilder()
            .Header(heading, 3)
            .EmptyLine()
            .Text(GeneratorHelpers.RenderApiItemMetadata(options.ApiItem))
            .Code(codeInline, GeneratorHelpers.DEFAULT_CODE_OPTIONS)
            .EmptyLine()
            .Text(GeneratorHelpers.TypeDtoToString(this.resolveTypeDto(options), options.ExtractedData))
            .GetOutput();

        // TypeParameters
        const apiTypeParameters = GeneratorHelpers
            .GetApiItemsFromReference<Contracts.ApiTypeParameterDto>(options.ApiItem.TypeParameters, options.ExtractedData);
        const typeParametersResult = this.RenderTypeParameters(apiTypeParameters);
        GeneratorHelpers.MergePluginResultData(pluginResult, typeParametersResult);

        // // Type
        // const typeResult = this.RenderType(options.ApiItem.Type);
        // GeneratorHelpers.MergePluginResultData(pluginResult, typeResult);

        return pluginResult;
    }
}
