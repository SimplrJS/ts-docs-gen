import { Contracts } from "ts-extractor";
import { MarkdownBuilder } from "@simplrjs/markdown";

import { BasePlugin } from "./base-plugin";
import { PluginResultData } from "../contracts/plugin";
import { GeneratorHelpers } from "../generator-helpers";

export abstract class PropertyLikePlugin<TKind = Contracts.ApiItemDto> extends BasePlugin<TKind> {
    protected RenderType(type?: Contracts.TypeDto): PluginResultData | undefined {
        if (type == null) {
            return undefined;
        }
        const pluginResult = GeneratorHelpers.GetDefaultPluginResultData();

        const parsedReturnType = GeneratorHelpers.TypeDtoToMarkdownString(type);

        pluginResult.Result = new MarkdownBuilder()
            .EmptyLine()
            .Bold("Type")
            .EmptyLine()
            .Text(parsedReturnType.Text)
            .GetOutput();

        pluginResult.UsedReferences = parsedReturnType.References;
        return pluginResult;
    }
}
