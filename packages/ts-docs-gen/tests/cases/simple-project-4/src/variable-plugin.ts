import { Contracts } from "ts-extractor";
import { BasePlugin } from "@src/abstractions/base-plugin";
import { SupportedApiItemKindType, PluginResult, PluginOptions } from "@src/contracts/plugin";
import { GeneratorHelpers } from "@src/generator-helpers";
import { MarkdownBuilder } from "@simplrjs/markdown";

export class VariablePlugin extends BasePlugin<Contracts.ApiVariableDto> {
    public SupportedApiDefinitionKind(): SupportedApiItemKindType[] {
        return [GeneratorHelpers.ApiDefinitionKind.Variable];
    }

    public Render(options: PluginOptions, apiItem: Contracts.ApiVariableDto): PluginResult<Contracts.ApiVariableDto> {
        const heading: string = `My variable ${options.Reference.Alias}`;

        const pluginResult: PluginResult<Contracts.ApiVariableDto> = {
            ...GeneratorHelpers.GetDefaultPluginResultData(),
            ApiItem: apiItem,
            Reference: options.Reference,
            Headings: [
                {
                    ApiItemId: options.Reference.Id,
                    Heading: heading
                }
            ],
            UsedReferences: [options.Reference.Id]
        };

        pluginResult.Result = new MarkdownBuilder()
            .Header(heading, 3)
            .EmptyLine()
            .Text("Variable plugin result.")
            .GetOutput();

        return pluginResult;
    }
}
