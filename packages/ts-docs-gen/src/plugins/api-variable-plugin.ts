import { Contracts } from "ts-extractor";
import { MarkdownGenerator } from "@simplrjs/markdown";

import { ApiItemPluginBase } from "../abstractions/api-item-plugin-base";
import { SupportedApiItemKindType } from "../contracts/supported-api-item-kind-type";
import { RenderItemOutputDto } from "../contracts/render-item-output-dto";
import { PluginData } from "../contracts/plugin-data";
import { ExtractorHelpers } from "../extractor-helpers";
import { GeneratorHelpers } from "../generator-helpers";

export class ApiVariablePlugin extends ApiItemPluginBase<Contracts.ApiVariableDto> {
    public SupportedApiItemsKinds(): SupportedApiItemKindType[] {
        return [this.SupportKind.Variable];
    }

    public Render(data: PluginData<Contracts.ApiVariableDto>): RenderItemOutputDto {
        const [, alias] = data.Reference;
        let references: string[] = [];
        const heading = alias;

        let documentationComment: string[] = [];
        if (data.ApiItem.Metadata.DocumentationComment.length > 0) {
            documentationComment = [
                ...data.ApiItem.Metadata.DocumentationComment.map(x => x.text),
                ""
            ];
        }

        const typeStringDto = GeneratorHelpers.TypeDtoToMarkdownString(data.ApiItem.Type);
        references = references.concat(typeStringDto.References);

        const output: string[] = [
            MarkdownGenerator.header(heading, 2),
            "",
            ...documentationComment,
            ...MarkdownGenerator.code(ExtractorHelpers.ApiVariableToString(data.ApiItem), { lang: "typescript" }),
            "",
            MarkdownGenerator.header("Type", 3),
            "",
            typeStringDto.Text
        ];

        return {
            Heading: heading,
            ApiItem: data.ApiItem,
            References: references,
            RenderOutput: output
        };
    }
}
