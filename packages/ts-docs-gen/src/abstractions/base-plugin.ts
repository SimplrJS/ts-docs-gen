import { Contracts, ExtractDto } from "ts-extractor";
import { MarkdownBuilder } from "@simplrjs/markdown";

import { Plugin, SupportedApiItemKindType, PluginOptions, PluginResult, PluginResultData } from "../contracts/plugin";
import { GeneratorHelpers } from "../generator-helpers";

export abstract class BasePlugin<TKind = Contracts.ApiItemDto> implements Plugin<TKind> {
    public abstract SupportedApiItemKinds(): SupportedApiItemKindType[];

    public CheckApiItem(item: TKind): boolean {
        return true;
    }

    // TODO: Escape string!
    protected RenderTypeParameters(
        typeParameters: Contracts.ApiTypeParameterDto[],
        extractedData: ExtractDto
    ): PluginResultData | undefined {
        if (typeParameters.length === 0) {
            return undefined;
        }

        const pluginResult = GeneratorHelpers.GetDefaultPluginResultData();
        const header = ["Name", "Constraint type", "Default type"];

        const content = typeParameters.map(typeParameter => {
            // ConstraintType
            let constraintType: string;
            if (typeParameter.ConstraintType != null) {
                constraintType = GeneratorHelpers.ApiTypeToString(typeParameter.ConstraintType, extractedData);
                GeneratorHelpers.MergePluginResultData(pluginResult, {
                    // UsedReferences: constraintType.References
                });
            } else {
                constraintType = "";
                // constraintType = { References: [], Text: "" };
            }

            // DefaultType
            let defaultType: string;
            if (typeParameter.DefaultType != null) {
                defaultType = GeneratorHelpers.ApiTypeToString(typeParameter.DefaultType, extractedData);
                GeneratorHelpers.MergePluginResultData(pluginResult, {
                    // UsedReferences: defaultType.References
                });
            } else {
                defaultType = "";
                // defaultType = { References: [], Text: "" };
            }

            return [
                typeParameter.Name,
                constraintType,
                defaultType
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

    protected RenderType(type: Contracts.ApiType | undefined, extractedData: ExtractDto): PluginResultData | undefined {
        if (type == null) {
            return undefined;
        }
        const pluginResult = GeneratorHelpers.GetDefaultPluginResultData();

        const parsedReturnType = GeneratorHelpers.ApiTypeToString(type, extractedData);

        pluginResult.Result = new MarkdownBuilder()
            .EmptyLine()
            .Bold("Type")
            .EmptyLine()
            .Text(parsedReturnType)
            .GetOutput();

        // pluginResult.UsedReferences = parsedReturnType.References;
        return pluginResult;
    }

    public abstract Render(data: PluginOptions<TKind>): PluginResult;
}
