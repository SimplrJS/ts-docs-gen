import { Contracts, ExtractDto } from "ts-extractor";
import { MarkdownBuilder } from "@simplrjs/markdown";

import { BasePlugin } from "./base-plugin";
import { PluginResultData } from "../contracts/plugin";
import { GeneratorHelpers } from "../generator-helpers";
import { ApiTypes } from "../api-items/api-type-list";
import { ApiParameter } from "../api-items/definitions/api-parameter";

export abstract class FunctionLikePlugin<TKind extends Contracts.ApiBaseDefinition = Contracts.ApiDefinition> extends BasePlugin<TKind> {
    protected RenderParameters(extractedData: ExtractDto, parameters: ApiParameter[]): PluginResultData | undefined {
        if (parameters.length === 0) {
            return undefined;
        }

        const pluginResult = GeneratorHelpers.GetDefaultPluginResultData();
        const header = ["Name", "Type", "Default value", "Description"];

        const content = parameters.map(parameter => {
            const type = parameter.Type
                .ToInlineText(this.RenderReferences(extractedData, pluginResult.UsedReferences));

            // TODO: Add Resolving simple metadata.
            return [
                parameter.Name,
                type,
                parameter.ApiItem.Initializer || "",
                parameter.ApiItem.Metadata.DocumentationComment
            ];
        });

        pluginResult.Result = new MarkdownBuilder()
            .EmptyLine()
            .Bold("Parameters")
            .EmptyLine()
            .Table(header, content, GeneratorHelpers.DEFAULT_TABLE_OPTIONS)
            .GetOutput();

        return pluginResult;
    }

    protected RenderReturnType(extractedData: ExtractDto, type: ApiTypes | undefined): PluginResultData | undefined {
        if (type == null) {
            return undefined;
        }
        const pluginResult = GeneratorHelpers.GetDefaultPluginResultData();

        pluginResult.Result = new MarkdownBuilder()
            .EmptyLine()
            .Bold("Return type")
            .EmptyLine()
            .Text(type.ToInlineText(this.RenderReferences(extractedData, pluginResult.UsedReferences)))
            .GetOutput();

        return pluginResult;
    }
}
