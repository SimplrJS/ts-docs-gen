import { Contracts, ExtractDto } from "ts-extractor";
import { MarkdownBuilder } from "@simplrjs/markdown";

import { BasePlugin } from "./base-plugin";
import { PluginResultData } from "../contracts/plugin";
import { GeneratorHelpers } from "../generator-helpers";
import { ApiTypes } from "../api-items/api-type-list";
import { ApiParameter } from "../api-items/definitions/api-parameter";

export abstract class FunctionLikePlugin<TKind extends Contracts.ApiBaseItemDto = Contracts.ApiItemDto> extends BasePlugin<TKind> {
    // TODO: Escape string!
    protected RenderParameters(parameters: ApiParameter[]): PluginResultData | undefined {
        if (parameters.length === 0) {
            return undefined;
        }

        const pluginResult = GeneratorHelpers.GetDefaultPluginResultData();
        const header = ["Name", "Type", "Description"];

        const content = parameters.map(parameter => {
            GeneratorHelpers.MergePluginResultData(pluginResult, {
                // UsedReferences: parameterTypeDto.References
            });

            // TODO: Add Resolving simple metadata.
            return [parameter.Data.Name, parameter.Type.ToText().join(" "), parameter.Data.Metadata.DocumentationComment];
        });

        pluginResult.Result = new MarkdownBuilder()
            .EmptyLine()
            .Bold("Parameters")
            .EmptyLine()
            .Table(header, content, GeneratorHelpers.DEFAULT_TABLE_OPTIONS)
            .GetOutput();

        return pluginResult;
    }

    protected RenderReturnType(type: ApiTypes | undefined): PluginResultData | undefined {
        if (type == null) {
            return undefined;
        }
        const pluginResult = GeneratorHelpers.GetDefaultPluginResultData();

        pluginResult.Result = new MarkdownBuilder()
            .EmptyLine()
            .Bold("Return type")
            .EmptyLine()
            .Text(type.ToText().join(" "))
            .GetOutput();

        // pluginResult.UsedReferences = parsedReturnType.References;
        return pluginResult;
    }
}
