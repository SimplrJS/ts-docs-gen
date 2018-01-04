import { Contracts } from "ts-extractor";
import { MarkdownGenerator, MarkdownBuilder } from "@simplrjs/markdown";

import { BasePlugin } from "./base-plugin";
import { PluginResultData } from "../contracts/plugin";
import { GeneratorHelpers } from "../generator-helpers";

export abstract class FunctionLikePlugin<TKind = Contracts.ApiItemDto> extends BasePlugin<TKind> {
    // TODO: Escape string!
    protected RenderTypeParameters(typeParameters: Contracts.ApiTypeParameterDto[]): PluginResultData | undefined {
        if (typeParameters.length === 0) {
            return undefined;
        }

        const pluginResult = GeneratorHelpers.GetDefaultPluginResultData();
        const header = ["Name", "Constraint type", "Default type"];

        const content = typeParameters.map(typeParameter => {
            // ConstraintType
            let constraintType: GeneratorHelpers.TypeToStringDto;
            if (typeParameter.ConstraintType != null) {
                constraintType = GeneratorHelpers.TypeDtoToMarkdownString(typeParameter.ConstraintType);
                GeneratorHelpers.MergePluginResultData(pluginResult, {
                    UsedReferences: constraintType.References
                });
            } else {
                constraintType = { References: [], Text: "" };
            }

            // DefaultType
            let defaultType: GeneratorHelpers.TypeToStringDto;
            if (typeParameter.DefaultType != null) {
                defaultType = GeneratorHelpers.TypeDtoToMarkdownString(typeParameter.DefaultType);
                GeneratorHelpers.MergePluginResultData(pluginResult, {
                    UsedReferences: defaultType.References
                });
            } else {
                defaultType = { References: [], Text: "" };
            }

            return [
                typeParameter.Name,
                constraintType.Text,
                defaultType.Text
            ];
        });

        pluginResult.Result = new MarkdownBuilder()
            .EmptyLine()
            .Bold("Type parameters")
            .EmptyLine()
            .Table(header, content, GeneratorHelpers.DEFAULT_TABLE_OPTIONS)
            .GetOutput();

        return pluginResult;
    }

    // TODO: Escape string!
    protected RenderParameters(parameters: Contracts.ApiParameterDto[]): PluginResultData | undefined {
        if (parameters.length === 0) {
            return undefined;
        }

        const pluginResult = GeneratorHelpers.GetDefaultPluginResultData();
        const header = ["Name", "Type", "Description"];

        const content = parameters.map(parameter => {
            const parameterTypeDto = GeneratorHelpers.TypeDtoToMarkdownString(parameter.Type);
            GeneratorHelpers.MergePluginResultData(pluginResult, {
                UsedReferences: parameterTypeDto.References
            });

            return [parameter.Name, MarkdownGenerator.EscapeString(parameterTypeDto.Text), parameter.Metadata.DocumentationComment];
        });

        pluginResult.Result = new MarkdownBuilder()
            .EmptyLine()
            .Bold("Parameters")
            .EmptyLine()
            .Table(header, content, GeneratorHelpers.DEFAULT_TABLE_OPTIONS)
            .GetOutput();

        return pluginResult;
    }

    protected RenderReturnType(type?: Contracts.TypeDto): PluginResultData | undefined {
        if (type == null) {
            return undefined;
        }
        const pluginResult = GeneratorHelpers.GetDefaultPluginResultData();

        const parsedReturnType = GeneratorHelpers.TypeDtoToMarkdownString(type);

        pluginResult.Result = new MarkdownBuilder()
            .EmptyLine()
            .Bold("Return type")
            .EmptyLine()
            .Text(parsedReturnType.Text)
            .GetOutput();

        pluginResult.UsedReferences = parsedReturnType.References;
        return pluginResult;
    }
}
