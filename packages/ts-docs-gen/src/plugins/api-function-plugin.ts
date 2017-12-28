import { Contracts } from "ts-extractor";
import { MarkdownBuilder } from "@simplrjs/markdown";

import { GeneratorHelpers } from "../generator-helpers";
import { SupportedApiItemKindType, Plugin, PluginResult, PluginOptions, PluginHeading } from "../contracts/plugin";
import { ApiFunctionDto } from "ts-extractor/dist/contracts";

export class ApiFunctionPlugin implements Plugin<Contracts.ApiFunctionDto> {
    public SupportedApiItemKinds(): SupportedApiItemKindType[] {
        return [GeneratorHelpers.ApiItemKinds.Function];
    }

    public CheckApiItem(item: ApiFunctionDto): boolean {
        return true;
    }

    // TODO: add description from @param jsdoc tag.
    private resolveFunctionParameters(parameters: Contracts.ApiParameterDto[]): GeneratorHelpers.ReferenceDto<string[]> {
        if (parameters.length === 0) {
            return {
                References: [],
                Text: []
            };
        }

        const table = GeneratorHelpers.ApiParametersToTableString(parameters);
        const builder = new MarkdownBuilder()
            .Header("Parameters", 3)
            .EmptyLine()
            .Text(table.Text)
            .EmptyLine();

        return {
            Text: builder.GetOutput(),
            References: table.References
        };
    }

    private resolveFunctionTypeParameters(typeParameters: Contracts.ApiTypeParameterDto[]): GeneratorHelpers.ReferenceDto<string[]> {
        const typeParametersTable = GeneratorHelpers.ApiTypeParametersTableToString(typeParameters);
        const text = new MarkdownBuilder()
            .Header("Type parameters", 3)
            .EmptyLine()
            .Text(typeParametersTable.Text)
            .EmptyLine()
            .GetOutput();

        return {
            References: typeParametersTable.References,
            Text: text
        };
    }

    private resolveReturnType(typeDto?: Contracts.TypeDto): GeneratorHelpers.ReferenceDto<string[]> {
        if (typeDto == null) {
            return {
                References: [],
                Text: []
            };
        }

        const parsedReturnType = GeneratorHelpers.TypeDtoToMarkdownString(typeDto);

        const text = new MarkdownBuilder()
            .Header("Return type", 3)
            .EmptyLine()
            .Text(parsedReturnType.Text)
            .EmptyLine()
            .GetOutput();

        return {
            Text: text,
            References: parsedReturnType.References
        };
    }

    public Render(data: PluginOptions<Contracts.ApiFunctionDto>): PluginResult {
        const alias = data.Reference.Alias;

        const headings: PluginHeading[] = [
            {
                ApiItemId: data.Reference.Id,
                Heading: alias
            }
        ];

        const parameters = GeneratorHelpers.GetApiItemsFromReference<Contracts.ApiParameterDto>(
            data.ApiItem.Parameters,
            data.ExtractedData
        );
        const resolvedParametersDto = this.resolveFunctionParameters(parameters);

        const typeParameters = GeneratorHelpers.GetApiItemsFromReference<Contracts.ApiTypeParameterDto>(
            data.ApiItem.TypeParameters,
            data.ExtractedData
        );
        const resolvedTypeParametersDto = this.resolveFunctionTypeParameters(typeParameters);

        const resolvedReturnTypeDto = this.resolveReturnType(data.ApiItem.ReturnType);

        const builder = new MarkdownBuilder()
            .Header(GeneratorHelpers.ApiFunctionToSimpleString(alias, data.ApiItem, parameters), 2)
            .EmptyLine()
            .Text(GeneratorHelpers.RenderApiItemMetadata(data.ApiItem))
            .Code(GeneratorHelpers.ApiFunctionToString(
                data.ApiItem,
                typeParameters,
                parameters,
                data.Reference.Alias
            ), GeneratorHelpers.DEFAULT_CODE_OPTIONS)
            .EmptyLine()
            .Text(resolvedTypeParametersDto.Text)
            .Text(resolvedParametersDto.Text)
            .Text(resolvedReturnTypeDto.Text);

        return {
            ApiItem: data.ApiItem,
            Reference: data.Reference,
            Headings: headings,
            UsedReferences: [
                ...resolvedParametersDto.References,
                ...resolvedTypeParametersDto.References,
                ...resolvedReturnTypeDto.References
            ],
            Result: builder.GetOutput()
        };
    }
}
