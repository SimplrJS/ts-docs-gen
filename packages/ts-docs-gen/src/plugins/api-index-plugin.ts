import { Contracts } from "ts-extractor";
import { MarkdownBuilder } from "@simplrjs/markdown";

import { Plugin, SupportedApiItemKindType, PluginResult, PluginOptions } from "../contracts/plugin";
import { GeneratorHelpers } from "../generator-helpers";

export class ApiIndexPlugin implements Plugin<Contracts.ApiIndexDto> {
    public SupportedApiItemKinds(): SupportedApiItemKindType[] {
        return [GeneratorHelpers.ApiItemKinds.Index];
    }

    public CheckApiItem(item: Contracts.ApiIndexDto): boolean {
        return true;
    }

    public Render(data: PluginOptions<Contracts.ApiIndexDto>): PluginResult<Contracts.ApiIndexDto> {
        const parameter = data.ExtractedData.Registry[data.ApiItem.Parameter] as Contracts.ApiParameterDto;

        const parameterType = GeneratorHelpers.TypeDtoToMarkdownString(parameter.Type);
        const indexType = GeneratorHelpers.TypeDtoToMarkdownString(data.ApiItem.Type);

        const indexDeclarationString = GeneratorHelpers.ApiIndexToString(parameter, data.ApiItem.Type, data.ApiItem.IsReadonly);

        const builder = new MarkdownBuilder()
            .Code(indexDeclarationString, GeneratorHelpers.DEFAULT_CODE_OPTIONS)
            .EmptyLine();

        if (data.ApiItem.IsReadonly) {
            builder
                .Text("Readonly.")
                .EmptyLine();
        }

        builder
            .Text(`Index \`${parameter.Name}\` - ${parameterType.Text}`)
            .EmptyLine()
            .Text(`Type - ${indexType.Text}`);

        return {
            ApiItem: data.ApiItem,
            Reference: data.Reference,
            Headings: [],
            Result: builder.GetOutput(),
            UsedReferences: [
                ...parameterType.References,
                ...indexType.References
            ]
        };
    }
}
