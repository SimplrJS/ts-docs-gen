import { Contracts } from "ts-extractor";
import { MarkdownBuilder } from "@simplrjs/markdown";

import { ApiItemPluginBase } from "../abstractions/api-item-plugin-base";
import { SupportedApiItemKindType } from "../contracts/supported-api-item-kind-type";
import { RenderItemOutputDto } from "../contracts/render-item-output-dto";
import { PluginData } from "../contracts/plugin-data";
import { GeneratorHelpers } from "../generator-helpers";
import { ExtractorHelpers } from "../extractor-helpers";

export class ApiFunctionPlugin extends ApiItemPluginBase<Contracts.ApiFunctionDto> {
    public SupportedApiItemsKinds(): SupportedApiItemKindType[] {
        return [this.SupportKind.Function];
    }

    private resolveFunctionHeader(
        alias: string,
        parametersApiItems: Contracts.ApiParameterDto[],
        typeParametersApiItems: Contracts.ApiTypeParameterDto[],
        apiItem: Contracts.ApiFunctionDto
    ): string {
        let functionHeader = `function ${apiItem.Name}`;

        // Resolving type parameters
        if (typeParametersApiItems.length > 0) {
            const typeParameters = typeParametersApiItems
                .map(GeneratorHelpers.TypeParameterToString)
                .join(", ");

            functionHeader += `<${typeParameters}>`;
        }

        // Resolving parameters
        const parametersString = parametersApiItems
            .map(parameter => `${parameter.Name}: ${GeneratorHelpers.TypeDtoToString(parameter.Type)}`)
            .join(", ");

        functionHeader += `(${parametersString})`;

        // Resolving return type
        // Ask @Martynas for cases where function have no return type.
        if (apiItem.ReturnType != null) {
            functionHeader += ": " + GeneratorHelpers.TypeDtoToString(apiItem.ReturnType);
        }

        return functionHeader;
    }

    private resolveDocumentationComment(metaData: Contracts.ApiMetadataDto): string[] {
        if (metaData.DocumentationComment.length === 0) {
            return [];
        }

        // TODO: implement ExtractorHelpers.FixSentence when comments separation implemented in `ts-extractor`.
        return metaData.DocumentationComment.map(commentItem => commentItem.text);
    }

    // private resolveFunctionParameters(): string[] {
    //     const builder = new MarkdownBuilder();
    //     return builder.GetOutput();
    // }

    private resolveFunctionTypeParameters(typeParameters: Contracts.ApiTypeParameterDto[]): string[] {
        const builder = new MarkdownBuilder();

        // typeParameters.map(parameter => {
        //     console.log(parameter);
        // });

        return builder.GetOutput();
    }

    public Render(data: PluginData<Contracts.ApiFunctionDto>): RenderItemOutputDto {
        const [, alias] = data.Reference;
        const parameters = ExtractorHelpers.GetApiItemsFromReferenceTuple<Contracts.ApiParameterDto>(
            data.ApiItem.Parameters,
            data.ExtractedData
        );

        console.log(data.ApiItem.Metadata);

        const typeParameters = ExtractorHelpers.GetApiItemsFromReferenceTuple<Contracts.ApiTypeParameterDto>(
            data.ApiItem.TypeParameters,
            data.ExtractedData
        );

        const headerString = this.resolveFunctionHeader(alias, parameters, typeParameters, data.ApiItem);
        const builder = new MarkdownBuilder()
            .Header(headerString, 2)
            .EmptyLine()
            .Text(this.resolveDocumentationComment(data.ApiItem.Metadata))
            .EmptyLine()
            .Text("TODO: is deprecated or beta")
            .EmptyLine()
            .Header("Type parameters", 3)
            .EmptyLine()
            .Text(this.resolveFunctionTypeParameters(typeParameters))
            .EmptyLine()
            .Header("Parameters", 3)
            .EmptyLine()
            .Text("TODO")
            .EmptyLine()
            .Header("Return type", 3);

        // const returnTypeDto = GeneratorHelpers.TypeDtoToMarkdownString(data.ApiItem.ReturnType!);
        // console.log(returnTypeDto);

        return {
            Heading: alias,
            ApiItem: data.ApiItem,
            References: [],
            RenderOutput: builder.GetOutput()
        };
    }

}
