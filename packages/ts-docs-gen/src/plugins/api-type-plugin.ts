import { Contracts } from "ts-extractor";
import { MarkdownBuilder } from "@simplrjs/markdown";

import { GeneratorHelpers } from "../generator-helpers";
import { Plugin, SupportedApiItemKindType, PluginOptions, PluginResult, PluginHeading } from "../contracts/plugin";

export class ApiTypePlugin implements Plugin<Contracts.ApiTypeDto> {
    public SupportedApiItemKinds(): SupportedApiItemKindType[] {
        return [GeneratorHelpers.ApiItemKinds.Type];
    }

    public CheckApiItem(item: Contracts.ApiItemDto): boolean {
        return true;
    }

    public Render(data: PluginOptions<Contracts.ApiTypeDto>): PluginResult {
        const heading = data.Reference.Alias;
        const headings: PluginHeading[] = [
            {
                Heading: heading,
                ApiItemId: data.Reference.Id
            }
        ];
        const typeStringDto = GeneratorHelpers.TypeDtoToMarkdownString(data.ApiItem.Type);

        // Header
        const builder = new MarkdownBuilder()
            .Header(heading, 2)
            .EmptyLine()
            .Text(GeneratorHelpers.RenderApiItemMetadata(data.ApiItem))
            .Code(GeneratorHelpers.ApiTypeToString(data.ApiItem), GeneratorHelpers.DEFAULT_CODE_OPTIONS)
            .EmptyLine()
            .Header("Type", 3)
            .EmptyLine()
            .Text(typeStringDto.Text);

        return {
            ApiItem: data.ApiItem,
            Reference: data.Reference,
            Headings: headings,
            UsedReferences: typeStringDto.References,
            Result: builder.GetOutput()
        };
    }
}
