import { Contracts, ExtractDto } from "ts-extractor";
import { MarkdownBuilder, MarkdownGenerator } from "@simplrjs/markdown";

import { Plugin, SupportedApiItemKindType, PluginOptions, PluginResult, PluginResultData } from "../contracts/plugin";
import { GeneratorHelpers } from "../generator-helpers";
import { ApiTypeParameter } from "../api-items/definitions/api-type-parameter";
import { ApiTypes } from "../api-items/api-type-list";
import { ReferenceRenderHandler } from "../contracts/serialized-api-item";

export abstract class BasePlugin<TKind extends Contracts.ApiBaseDefinition = Contracts.ApiDefinition> implements Plugin<TKind> {
    // tslint:disable-next-line:no-empty
    public static TsDocsGenPlugin(): void { }

    public abstract SupportedApiDefinitionKind(): SupportedApiItemKindType[];

    public CheckApiItem(item: TKind): boolean {
        return true;
    }

    protected RenderApiItemMetadata(apiItem: Contracts.ApiDefinition): string[] {
        const builder = new MarkdownBuilder();

        // Optimise?
        const beta = apiItem.Metadata.JSDocTags.find(x => x.name.toLowerCase() === GeneratorHelpers.JSDocTags.Deprecated);
        const deprecated = apiItem.Metadata.JSDocTags.find(x => x.name.toLowerCase() === GeneratorHelpers.JSDocTags.Deprecated);
        const internal = apiItem.Metadata.JSDocTags.find(x => x.name.toLowerCase() === GeneratorHelpers.JSDocTags.Internal);
        const summary = apiItem.Metadata.JSDocTags.find(x => x.name.toLowerCase() === GeneratorHelpers.JSDocTags.Summary);
        const jSDocComment = apiItem.Metadata.DocumentationComment;

        if (beta != null) {
            const message = Boolean(beta.text) ? `: ${beta.text}` : "";
            builder
                .Bold(`Warning Beta${message}!`)
                .EmptyLine();
        }

        if (deprecated != null) {
            const message = Boolean(deprecated.text) ? `: ${deprecated.text}` : "";
            builder
                .Text(`Deprecated${message}!</span>`)
                .EmptyLine();
        }

        if (internal != null) {
            const message = Boolean(internal.text) ? `: ${internal.text}` : "";
            builder
                .Bold(`Internal${message}!`)
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

    protected RenderTypeParameters(extractedData: ExtractDto, typeParameters: ApiTypeParameter[]): PluginResultData | undefined {
        if (typeParameters.length === 0) {
            return undefined;
        }

        const pluginResult = GeneratorHelpers.GetDefaultPluginResultData();
        const header = ["Name", "Constraint", "Default"];

        const content = typeParameters.map(typeParameter => {
            // ConstraintType
            let constraintType: string;
            if (typeParameter.ConstraintType != null) {
                constraintType = typeParameter.ConstraintType
                    .ToInlineText(this.RenderReferences(extractedData, pluginResult.UsedReferences));
            } else {
                constraintType = "";
            }

            // DefaultType
            let defaultType: string;
            if (typeParameter.DefaultType != null) {
                defaultType = typeParameter.DefaultType
                    .ToInlineText(this.RenderReferences(extractedData, pluginResult.UsedReferences));
            } else {
                defaultType = "";
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

    protected RenderType(extractedData: ExtractDto, type: ApiTypes | undefined): PluginResultData | undefined {
        if (type == null) {
            return undefined;
        }

        const pluginResult = GeneratorHelpers.GetDefaultPluginResultData();
        const parsedReturnType = type.ToInlineText(this.RenderReferences(extractedData, pluginResult.UsedReferences));

        pluginResult.Result = new MarkdownBuilder()
            .EmptyLine()
            .Bold("Type")
            .EmptyLine()
            .Text(parsedReturnType)
            .GetOutput();

        return pluginResult;
    }

    /**
     * Default reference rending with markdown links.
     * @param usedReferences populates given array with used references.
     */
    protected RenderReferences(extractedData: ExtractDto, usedReferences: string[]): ReferenceRenderHandler {
        return (name, reference) => {
            if (reference == null) {
                return name;
            }
            const apiItem = extractedData.Registry[reference];
            if (apiItem.ApiKind === Contracts.ApiDefinitionKind.TypeParameter) {
                return name;
            }

            usedReferences.push(reference);

            return MarkdownGenerator.Link(name, reference, true);
        };
    }

    public abstract Render(options: PluginOptions, apiItem: TKind): PluginResult;
}
