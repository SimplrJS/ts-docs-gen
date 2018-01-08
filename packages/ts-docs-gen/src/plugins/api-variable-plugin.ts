import { Contracts } from "ts-extractor";
import { MarkdownBuilder } from "@simplrjs/markdown";

import { GeneratorHelpers } from "../generator-helpers";
import { SupportedApiItemKindType, PluginOptions, PluginResult } from "../contracts/plugin";
import { BasePlugin } from "../abstractions/base-plugin";

export class ApiVariablePlugin extends BasePlugin<Contracts.ApiVariableDto> {
    public SupportedApiItemKinds(): SupportedApiItemKindType[] {
        return [GeneratorHelpers.ApiItemKinds.Variable];
    }

    public Render(options: PluginOptions<Contracts.ApiVariableDto>): PluginResult {
        const heading: string = options.Reference.Alias;
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

        // Type
        const typeStringDto = GeneratorHelpers.TypeDtoToMarkdownString(options.ApiItem.Type);

        pluginResult.Result = new MarkdownBuilder()
            .Header(heading, 3)
            .EmptyLine()
            .Text(GeneratorHelpers.RenderApiItemMetadata(options.ApiItem))
            .Code(GeneratorHelpers.ApiVariableToString(options.ApiItem), GeneratorHelpers.DEFAULT_CODE_OPTIONS)
            .EmptyLine()
            .Bold("Type")
            .EmptyLine()
            .Text(typeStringDto.Text)
            .GetOutput();

        return pluginResult;
    }
}
