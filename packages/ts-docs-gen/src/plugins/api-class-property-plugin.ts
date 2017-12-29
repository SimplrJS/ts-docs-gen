import { Contracts } from "ts-extractor";
import { MarkdownBuilder } from "@simplrjs/markdown";
import { Plugin, SupportedApiItemKindType, PluginOptions, PluginResult } from "../contracts/plugin";
import { GeneratorHelpers } from "../generator-helpers";

export class ApiClassPropertyPlugin implements Plugin<Contracts.ApiClassPropertyDto> {
    public SupportedApiItemKinds(): SupportedApiItemKindType[] {
        return [GeneratorHelpers.ApiItemKinds.ClassProperty];
    }

    public CheckApiItem(item: Contracts.ApiItemDto): boolean {
        return true;
    }

    public Render(options: PluginOptions<Contracts.ApiClassPropertyDto>): PluginResult {
        const pluginResultData = GeneratorHelpers.GetDefaultPluginResultData();
        const builder = new MarkdownBuilder();

        const heading = options.Reference.Alias;
        pluginResultData.Headings.push({ ApiItemId: options.Reference.Id, Heading: heading });

        const typeStringDto = GeneratorHelpers.TypeDtoToMarkdownString(options.ApiItem.Type);
        pluginResultData.UsedReferences = pluginResultData.UsedReferences.concat(typeStringDto.References);

        builder
            .Header(heading, 3)
            .EmptyLine()
            .Text(GeneratorHelpers.RenderApiItemMetadata(options.ApiItem))
            .Code(GeneratorHelpers.ApiClassPropertyToString(
                options.ApiItem,
                options.Reference.Alias
            ), GeneratorHelpers.DEFAULT_CODE_OPTIONS)
            .EmptyLine()
            .Header("Type", 3)
            .EmptyLine()
            .Text(typeStringDto.Text);

        pluginResultData.Result = builder.GetOutput();

        return {
            ApiItem: options.ApiItem,
            Reference: options.Reference,
            ...pluginResultData
        };
    }
}
