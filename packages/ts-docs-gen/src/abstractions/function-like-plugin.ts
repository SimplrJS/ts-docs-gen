import { Contracts, ExtractDto } from "ts-extractor";
import { MarkdownBuilder } from "@simplrjs/markdown";

import { BasePlugin } from "./base-plugin";
import { PluginResultData } from "../contracts/plugin";
import { GeneratorHelpers } from "../generator-helpers";

export abstract class FunctionLikePlugin<TKind extends Contracts.ApiBaseItemDto = Contracts.ApiItemDto> extends BasePlugin<TKind> {
    // TODO: Escape string!
    protected RenderParameters(extractedData: ExtractDto, parameters: Contracts.ApiParameterDto[]): PluginResultData | undefined {
        if (parameters.length === 0) {
            return undefined;
        }

        const pluginResult = GeneratorHelpers.GetDefaultPluginResultData();
        const header = ["Name", "Type", "Description"];

        const content = parameters.map(parameter => {
            const parameterTypeDto = GeneratorHelpers.SerializeApiType(extractedData, parameter.Type);
            GeneratorHelpers.MergePluginResultData(pluginResult, {
                // UsedReferences: parameterTypeDto.References
            });

            return [parameter.Name, parameterTypeDto.ToText().join(" "), parameter.Metadata.DocumentationComment];
        });

        pluginResult.Result = new MarkdownBuilder()
            .EmptyLine()
            .Bold("Parameters")
            .EmptyLine()
            .Table(header, content, GeneratorHelpers.DEFAULT_TABLE_OPTIONS)
            .GetOutput();

        return pluginResult;
    }

    protected RenderReturnType(extractedData: ExtractDto, type: Contracts.ApiType | undefined): PluginResultData | undefined {
        if (type == null) {
            return undefined;
        }
        const pluginResult = GeneratorHelpers.GetDefaultPluginResultData();

        const parsedReturnType = GeneratorHelpers.SerializeApiType(extractedData, type);

        pluginResult.Result = new MarkdownBuilder()
            .EmptyLine()
            .Bold("Return type")
            .EmptyLine()
            .Text(parsedReturnType.ToText().join(" "))
            .GetOutput();

        // pluginResult.UsedReferences = parsedReturnType.References;
        return pluginResult;
    }
}
