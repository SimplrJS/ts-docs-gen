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

    // TODO: add description from @param jsdoc tag.
    private resolveFunctionParameters(parameters: Contracts.ApiParameterDto[]): GeneratorHelpers.ReferenceDto<string[]> {
        if (parameters.length === 0) {
            return {
                References: [],
                Text: []
            };
        }

        let referenceIds: string[] = [];
        const header = ["Name", "Type", "Description"];

        const content = parameters.map(parameter => {
            const parameterTypeDto = GeneratorHelpers.TypeDtoToMarkdownString(parameter.Type);

            referenceIds = referenceIds.concat(parameterTypeDto.References);

            return [parameter.Name, parameterTypeDto.Text];
        });

        const text = new MarkdownBuilder()
            .Header("Parameters", 3)
            .EmptyLine()
            .Table(header, content, ExtractorHelpers.DEFAULT_TABLE_OPTIONS)
            .EmptyLine()
            .GetOutput();

        return {
            Text: text,
            References: referenceIds
        };
    }

    // TODO: add description from @template jsdoc tag.
    private resolveFunctionTypeParameters(typeParameters: Contracts.ApiTypeParameterDto[]): GeneratorHelpers.ReferenceDto<string[]> {
        let referenceIds: string[] = [];

        if (typeParameters.length === 0) {
            return {
                References: [],
                Text: []
            };
        }

        const header = ["Name", "Constraint type", "Default type"];
        const content = typeParameters.map(typeParameter => {
            let constraintType: string = "";
            let defaultType: string = "";

            if (typeParameter.ConstraintType) {
                const parsedConstraintType = GeneratorHelpers.TypeDtoToMarkdownString(typeParameter.ConstraintType);

                referenceIds = referenceIds.concat(parsedConstraintType.References);
                constraintType = parsedConstraintType.Text;
            }

            if (typeParameter.DefaultType) {
                const parsedDefaultType = GeneratorHelpers.TypeDtoToMarkdownString(typeParameter.DefaultType);

                referenceIds = referenceIds.concat(parsedDefaultType.References);
                defaultType = parsedDefaultType.Text;
            }

            return [typeParameter.Name, constraintType, defaultType];
        });

        const text = new MarkdownBuilder()
            .Header("Type parameters", 3)
            .EmptyLine()
            .Table(header, content, ExtractorHelpers.DEFAULT_TABLE_OPTIONS)
            .EmptyLine()
            .GetOutput();

        return {
            References: referenceIds,
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

    public Render(data: PluginData<Contracts.ApiFunctionDto>): RenderItemOutputDto {
        const [, alias] = data.Reference;

        const parameters = ExtractorHelpers.GetApiItemsFromReferenceTuple<Contracts.ApiParameterDto>(
            data.ApiItem.Parameters,
            data.ExtractedData
        );
        const resolvedParametersDto = this.resolveFunctionParameters(parameters);

        const typeParameters = ExtractorHelpers.GetApiItemsFromReferenceTuple<Contracts.ApiTypeParameterDto>(
            data.ApiItem.TypeParameters,
            data.ExtractedData
        );
        const resolvedTypeParametersDto = this.resolveFunctionTypeParameters(typeParameters);

        const resolvedReturnTypeDto = this.resolveReturnType(data.ApiItem.ReturnType);

        const builder = new MarkdownBuilder()
            .Header(ExtractorHelpers.ApiFunctionToString(alias, data.ApiItem, parameters), 2)
            .EmptyLine()
            .Text(GeneratorHelpers.RenderApiItemMetadata(data.ApiItem))
            .Text(resolvedTypeParametersDto.Text)
            .Text(resolvedParametersDto.Text)
            .Text(resolvedReturnTypeDto.Text);

        return {
            Heading: alias,
            ApiItem: data.ApiItem,
            References: [
                ...resolvedParametersDto.References,
                ...resolvedTypeParametersDto.References,
                ...resolvedReturnTypeDto.References
            ],
            RenderOutput: builder.GetOutput()
        };
    }

}
