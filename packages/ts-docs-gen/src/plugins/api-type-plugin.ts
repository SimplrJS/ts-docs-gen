import { Contracts } from "ts-extractor";
import { MarkdownBuilder } from "@simplrjs/markdown";

import { ApiItemPluginBase } from "../abstractions/api-item-plugin-base";
import { SupportedApiItemKindType } from "../contracts/supported-api-item-kind-type";
import { RenderItemOutputDto } from "../contracts/render-item-output-dto";
import { PluginData } from "../contracts/plugin-data";
import { ExtractorHelpers } from "../extractor-helpers";
import { GeneratorHelpers } from "../generator-helpers";

export class ApiTypePlugin extends ApiItemPluginBase<Contracts.ApiTypeDto> {
    public SupportedApiItemKinds(): SupportedApiItemKindType[] {
        return [this.ApiItemKinds.Type];
    }

    public Render(data: PluginData<Contracts.ApiTypeDto>): RenderItemOutputDto {
        const [, alias] = data.Reference;
        const heading = alias;
        const typeStringDto = GeneratorHelpers.TypeDtoToMarkdownString(data.ApiItem.Type);

        // Header
        const builder = new MarkdownBuilder()
            .Header(heading, 2)
            .EmptyLine()
            .Text(GeneratorHelpers.RenderApiItemMetadata(data.ApiItem))
            .Code(ExtractorHelpers.ApiTypeToString(data.ApiItem), ExtractorHelpers.DEFAULT_CODE_OPTIONS)
            .EmptyLine()
            .Header("Type", 3)
            .EmptyLine()
            .Text(typeStringDto.Text);

        return {
            Heading: heading,
            ApiItem: data.ApiItem,
            References: typeStringDto.References,
            RenderOutput: builder.GetOutput()
        };
    }
}