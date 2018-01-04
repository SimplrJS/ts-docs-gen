import { Contracts } from "ts-extractor";
import { MarkdownGenerator, MarkdownBuilder } from "@simplrjs/markdown";

import { BasePlugin } from "./base-plugin";
import { PluginResultData } from "../contracts/plugin";
import { GeneratorHelpers } from "../generator-helpers";

export abstract class FunctionLikePlugin<TKind = Contracts.ApiItemDto> extends BasePlugin<TKind> {
    protected RenderParameters(parameters: Contracts.ApiParameterDto[]): PluginResultData | undefined {
        if (parameters.length === 0) {
            return undefined;
        }

        const pluginResult = GeneratorHelpers.GetDefaultPluginResultData();

        let referenceIds: string[] = [];
        const header = ["Name", "Type", "Description"];

        const content = parameters.map(parameter => {
            const parameterTypeDto = GeneratorHelpers.TypeDtoToMarkdownString(parameter.Type);

            referenceIds = referenceIds.concat(parameterTypeDto.References);

            return [parameter.Name, MarkdownGenerator.EscapeString(parameterTypeDto.Text), parameter.Metadata.DocumentationComment];
        });

        const builder = new MarkdownBuilder()
            .Header("Parameters", 4)
            .EmptyLine()
            .Table(header, content, GeneratorHelpers.DEFAULT_TABLE_OPTIONS)
            .EmptyLine();

        pluginResult.UsedReferences = referenceIds;
        pluginResult.Result = builder.GetOutput();

        return pluginResult;
    }

}
