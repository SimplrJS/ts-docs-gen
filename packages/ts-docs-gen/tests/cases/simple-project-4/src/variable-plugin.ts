import { Contracts } from "ts-extractor";
import { BasePlugin } from "@src/abstractions/base-plugin";
import { SupportedApiItemKindType, PluginResult, PluginOptions } from "@src/contracts/plugin";
import { GeneratorHelpers } from "@src/generator-helpers";
import { MarkdownBuilder } from "@simplrjs/markdown";

export class VariablePlugin extends BasePlugin<Contracts.ApiVariableDto> {
    public SupportedApiItemKinds(): SupportedApiItemKindType[] {
        return [GeneratorHelpers.ApiItemKinds.Variable];
    }

    public Render(options: PluginOptions<Contracts.ApiVariableDto>): PluginResult<Contracts.ApiVariableDto> {
        const heading: string = `My variable ${options.Reference.Alias}`;

        const pluginResult: PluginResult<Contracts.ApiVariableDto> = {
            ...GeneratorHelpers.GetDefaultPluginResultData(),
            ApiItem: options.ApiItem,
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
