import { Contracts } from "ts-extractor";
import { MarkdownBuilder } from "@simplrjs/markdown";
import { SupportedApiItemKindType, PluginOptions, PluginResult } from "../contracts/plugin";
import { GeneratorHelpers } from "../generator-helpers";
import { FunctionLikePlugin } from "../abstractions/function-like-plugin";

export class ApiClassMethodPlugin extends FunctionLikePlugin<Contracts.ApiClassMethodDto> {
    public SupportedApiItemKinds(): SupportedApiItemKindType[] {
        return [GeneratorHelpers.ApiItemKinds.ClassMethod];
    }

    public CheckApiItem(item: Contracts.ApiItemDto): boolean {
        return true;
    }

    public Render(options: PluginOptions<Contracts.ApiClassMethodDto>): PluginResult {
        // Parameters
        const apiParameters = GeneratorHelpers
            .GetApiItemsFromReference<Contracts.ApiParameterDto>(options.ApiItem.Parameters, options.ExtractedData);
        // TypeParameters
        const apiTypeParameters = GeneratorHelpers
            .GetApiItemsFromReference<Contracts.ApiTypeParameterDto>(options.ApiItem.TypeParameters, options.ExtractedData);

        const heading = GeneratorHelpers.MethodToSimpleString(options.Reference.Alias, apiParameters);
        const pluginResult: PluginResult = {
            ...GeneratorHelpers.GetDefaultPluginResultData(),
            ApiItem: options.ApiItem,
            Reference: options.Reference,
            Headings: [
                {
                    Heading: heading,
                    ApiItemId: options.Reference.Id
                }
            ]
        };

        // Header
        pluginResult.Result = new MarkdownBuilder()
            .Header(heading, 3)
            .EmptyLine()
            .Text(GeneratorHelpers.RenderApiItemMetadata(options.ApiItem))
            .Code(GeneratorHelpers.ApiClassMethodToString(
                options.ApiItem,
                apiTypeParameters,
                apiParameters,
                options.Reference.Alias
            ), GeneratorHelpers.DEFAULT_CODE_OPTIONS)
            .GetOutput();

        // TypeParameters
        const typeParametersResult = this.RenderTypeParameters(apiTypeParameters);
        GeneratorHelpers.MergePluginResultData(pluginResult, typeParametersResult);

        // Parameters
        const parametersResult = this.RenderParameters(apiParameters);
        GeneratorHelpers.MergePluginResultData(pluginResult, parametersResult);

        // ReturnType
        const returnTypeResult = this.RenderReturnType(options.ApiItem.ReturnType);
        GeneratorHelpers.MergePluginResultData(pluginResult, returnTypeResult);

        return {
            ApiItem: options.ApiItem,
            Reference: options.Reference,
            ...pluginResult
        };
    }
}
