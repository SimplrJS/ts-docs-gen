import { Contracts } from "ts-extractor";
import { MarkdownBuilder } from "@simplrjs/markdown";
import { SupportedApiItemKindType, PluginOptions, PluginResult } from "../contracts/plugin";
import { GeneratorHelpers } from "../generator-helpers";
import { FunctionLikePlugin } from "../abstractions/function-like-plugin";

export class ApiClassConstructorPlugin extends FunctionLikePlugin<Contracts.ApiClassConstructorDto> {
    public SupportedApiItemKinds(): SupportedApiItemKindType[] {
        return [GeneratorHelpers.ApiItemKinds.ClassConstructor];
    }

    public Render(data: PluginOptions<Contracts.ApiClassConstructorDto>): PluginResult {
        // ApiParameters
        const apiParameters = GeneratorHelpers
            .GetApiItemsFromReference<Contracts.ApiParameterDto>(data.ApiItem.Parameters, data.ExtractedData);

        const heading = GeneratorHelpers.MethodToSimpleString("constructor", apiParameters);
        const pluginResult: PluginResult = {
            ...GeneratorHelpers.GetDefaultPluginResultData(),
            ApiItem: data.ApiItem,
            Reference: data.Reference,
            Headings: [
                {
                    Heading: heading,
                    ApiItemId: data.Reference.Id
                }
            ]
        };
        const builder = new MarkdownBuilder();


        // Header
        pluginResult.Result = builder
            .Header(heading, 3)
            .EmptyLine()
            .Text(GeneratorHelpers.RenderApiItemMetadata(data.ApiItem))
            .Code(GeneratorHelpers.ApiClassConstructorToString(apiParameters), GeneratorHelpers.DEFAULT_CODE_OPTIONS)
            .GetOutput();

        // Parameters
        const parametersResult = this.RenderParameters(apiParameters);
        GeneratorHelpers.MergePluginResultData(pluginResult, parametersResult);

        return pluginResult;
    }
}
