import { Contracts } from "ts-extractor";
import { MarkdownBuilder } from "@simplrjs/markdown";

import { Plugin, SupportedApiItemKindType, PluginResult, PluginOptions } from "../contracts/plugin";
import { GeneratorHelpers } from "../generator-helpers";

export type CallableApiItem = Contracts.ApiCallDto | Contracts.ApiMethodDto | Contracts.ApiConstructDto;

export class ApiCallablePlugin implements Plugin<CallableApiItem> {
    public SupportedApiItemKinds(): SupportedApiItemKindType[] {
        return [
            GeneratorHelpers.ApiItemKinds.Construct,
            GeneratorHelpers.ApiItemKinds.Call,
            GeneratorHelpers.ApiItemKinds.Method
        ];
    }

    public CheckApiItem(item: CallableApiItem): boolean {
        return true;
    }

    private resolveItemCode(
        apiItem: CallableApiItem,
        parameters: Contracts.ApiParameterDto[],
        typeParameters: Contracts.ApiTypeParameterDto[]
    ): string {
        switch (apiItem.ApiKind) {
            case Contracts.ApiItemKinds.Construct: {
                return GeneratorHelpers.ApiConstructToString(typeParameters, parameters, apiItem.ReturnType);
            }
            case Contracts.ApiItemKinds.Call: {
                return GeneratorHelpers.ApiCallToString(typeParameters, parameters, apiItem.ReturnType);
            }
            case Contracts.ApiItemKinds.Method: {
                return GeneratorHelpers.ApiMethodToString(apiItem.Name, typeParameters, parameters, apiItem.ReturnType);
            }
        }
    }

    public Render(data: PluginOptions<CallableApiItem>): PluginResult<CallableApiItem> {
        const usedReferences = [];
        const parameters = GeneratorHelpers.GetApiItemsFromReference<Contracts.ApiParameterDto>(
            data.ApiItem.Parameters,
            data.ExtractedData
        );
        const typeParameters = GeneratorHelpers.GetApiItemsFromReference<Contracts.ApiTypeParameterDto>(
            data.ApiItem.TypeParameters,
            data.ExtractedData
        );

        const builder = new MarkdownBuilder()
            .Code(this.resolveItemCode(data.ApiItem, parameters, typeParameters), GeneratorHelpers.DEFAULT_CODE_OPTIONS)
            .EmptyLine();

        if (typeParameters.length > 0) {
            const table = GeneratorHelpers.ApiTypeParametersTableToString(typeParameters);
            usedReferences.push(...table.References);

            builder
                .Bold("Type parameters:")
                .EmptyLine()
                .Text(table.Text)
                .EmptyLine();
        }

        if (parameters.length > 0) {
            const table = GeneratorHelpers.ApiParametersToTableString(parameters);
            usedReferences.push(...table.References);

            builder
                .Bold("Parameters:")
                .EmptyLine()
                .Text(table.Text)
                .EmptyLine();
        }

        if (data.ApiItem.ReturnType) {
            const renderedReturnType = GeneratorHelpers.TypeDtoToMarkdownString(data.ApiItem.ReturnType);

            builder
                .Bold("Return type:")
                .EmptyLine()
                .Text(renderedReturnType.Text);

            usedReferences.push(...renderedReturnType.References);
        }

        return {
            ApiItem: data.ApiItem,
            Reference: data.Reference,
            Headings: [],
            Result: builder.GetOutput(),
            UsedReferences: usedReferences
        };
    }
}
