import { Contracts } from "ts-extractor";
import { MarkdownBuilder } from "@simplrjs/markdown";

import { Plugin, SupportedApiItemKindType, PluginOptions, PluginResult, PluginResultData } from "../contracts/plugin";
import { GeneratorHelpers } from "../generator-helpers";
import { SerializedApiType } from "../contracts/serialized-api-item";
import { ApiTypeParameter } from "../api-items/definitions/api-type-parameter";

export abstract class BasePlugin<TKind extends Contracts.ApiBaseItemDto = Contracts.ApiItemDto> implements Plugin<TKind> {
    public abstract SupportedApiItemKinds(): SupportedApiItemKindType[];

    public CheckApiItem(item: TKind): boolean {
        return true;
    }

    protected RenderApiItemMetadata(apiItem: Contracts.ApiItemDto): string[] {
        const builder = new MarkdownBuilder();

        // Optimise?
        const isBeta = apiItem.Metadata.JSDocTags.findIndex(x => x.name.toLowerCase() === GeneratorHelpers.JSDocTags.Beta) !== -1;
        const deprecated = apiItem.Metadata.JSDocTags.find(x => x.name.toLowerCase() === GeneratorHelpers.JSDocTags.Deprecated);
        const internal = apiItem.Metadata.JSDocTags.find(x => x.name.toLowerCase() === GeneratorHelpers.JSDocTags.Internal);
        const summary = apiItem.Metadata.JSDocTags.find(x => x.name.toLowerCase() === GeneratorHelpers.JSDocTags.Summary);
        const jSDocComment = apiItem.Metadata.DocumentationComment;

        if (isBeta) {
            builder
                .Text(`<span style="color: #d2d255;">Warning: Beta!</span>`)
                .EmptyLine();
        }

        if (deprecated != null) {
            const message = Boolean(deprecated.text) ? `: ${deprecated.text}` : "";
            builder
                .Text(`<span style="color: red;">Deprecated${message}!</span>`)
                .EmptyLine();
        }

        if (internal != null) {
            const message = Boolean(internal.text) ? `: ${internal.text}` : "";
            builder
                .Bold(`Internal${message}`)
                .EmptyLine();
        }

        if (jSDocComment.length > 0) {
            builder
                .Text(jSDocComment)
                .EmptyLine();
        }

        if (summary != null && Boolean(summary.text)) {
            builder
                .Blockquote(summary.text!.split("\n"))
                .EmptyLine();
        }

        return builder.GetOutput();
    }

    // TODO: Escape string!
    protected RenderTypeParameters(typeParameters: ApiTypeParameter[]): PluginResultData | undefined {
        if (typeParameters.length === 0) {
            return undefined;
        }

        const pluginResult = GeneratorHelpers.GetDefaultPluginResultData();
        const header = ["Name", "Constraint type", "Default type"];

        const content = typeParameters.map(typeParameter => {
            // ConstraintType
            let constraintType: string;
            if (typeParameter.ConstraintType != null) {
                constraintType = typeParameter.ConstraintType.ToText().join(" ");
                GeneratorHelpers.MergePluginResultData(pluginResult, {
                    // FIXME: References.
                    // UsedReferences: constraintType.References
                });
            } else {
                constraintType = "";
                // FIXME: References.
                // constraintType = { References: [], Text: "" };
            }

            // DefaultType
            let defaultType: string;
            if (typeParameter.DefaultType != null) {
                defaultType = typeParameter.DefaultType.ToText().join(" ");
                GeneratorHelpers.MergePluginResultData(pluginResult, {
                    // FIXME: References.
                    // UsedReferences: defaultType.References
                });
            } else {
                // FIXME: References.
                defaultType = "";
                // defaultType = { References: [], Text: "" };
            }

            return [
                typeParameter.Data.Name,
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

    protected RenderType(type: SerializedApiType | undefined): PluginResultData | undefined {
        if (type == null) {
            return undefined;
        }

        const pluginResult = GeneratorHelpers.GetDefaultPluginResultData();
        const parsedReturnType = type.ToText().join(" ");

        pluginResult.Result = new MarkdownBuilder()
            .EmptyLine()
            .Bold("Type")
            .EmptyLine()
            .Text(parsedReturnType)
            .GetOutput();

        //FIXME: Reference
        // pluginResult.UsedReferences = parsedReturnType.References;
        return pluginResult;
    }

    public abstract Render(options: PluginOptions, apiItem: TKind): PluginResult;
}
