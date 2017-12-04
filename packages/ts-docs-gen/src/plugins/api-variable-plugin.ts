import { Contracts } from "ts-extractor";
import { MarkdownGenerator } from "@simplrjs/markdown";

import { ApiItemPluginBase } from "../abstractions/api-item-plugin-base";
import { SupportedApiItemKindType } from "../contracts/supported-api-item-kind-type";
import { RenderItemOutputDto } from "../contracts/render-item-output-dto";
import { PluginData } from "../contracts/plugin-data";
import { ExtractorHelpers } from "../extractor-helpers";
import { GeneratorHelpers } from "../generator-helpers";

export class ApiVariablePlugin extends ApiItemPluginBase {
    public SupportedApiItemsKinds(): SupportedApiItemKindType[] {
        return [this.SupportKind.Variable];
    }

    public Render(data: PluginData): RenderItemOutputDto {
        const [, alias] = data.Reference;
        const apiItem = data.ApiItem as Contracts.ApiVariableDto;
        const references: string[] = [];

        let documentationComment: string[] = [];
        if (apiItem.Metadata.DocumentationComment.length > 0) {
            documentationComment = [
                ...apiItem.Metadata.DocumentationComment.map(x => x.text),
                ""
            ];
        }

        const typeStringDto = GeneratorHelpers.TypeDtoToMarkdownString(apiItem.Type);
        references.concat(typeStringDto.References);

        const output: string[] = [
            MarkdownGenerator.header(alias, 2),
            "",
            ...documentationComment,
            ...MarkdownGenerator.code(ExtractorHelpers.ApiVariableToString(apiItem), { lang: "ts" }),
            "",
            MarkdownGenerator.header("Type", 3),
            "",
            typeStringDto.Text
        ];

        return {
            ApiItem: data.ApiItem,
            References: [],
            RenderOutput: output
        };
    }
}
