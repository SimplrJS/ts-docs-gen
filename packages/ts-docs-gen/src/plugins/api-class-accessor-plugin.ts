import { Contracts, ExtractDto } from "ts-extractor";
import { MarkdownBuilder } from "@simplrjs/markdown";

import { SupportedApiItemKindType, PluginOptions, PluginResult } from "../contracts/plugin";
import { GeneratorHelpers } from "../generator-helpers";
import { BasePlugin } from "../abstractions/base-plugin";

export type Kind = Contracts.ApiSetAccessorDto | Contracts.ApiGetAccessorDto;

export class ApiClassAccessorPlugin extends BasePlugin<Kind> {
    public SupportedApiItemKinds(): SupportedApiItemKindType[] {
        return [
            GeneratorHelpers.ApiItemKinds.GetAccessor,
            GeneratorHelpers.ApiItemKinds.SetAccessor,
        ];
    }

    private getHeading(data: PluginOptions<Kind>): string {
        let accessorType: string;
        if (data.ApiItem.ApiKind === Contracts.ApiItemKinds.SetAccessor) {
            accessorType = "set";
        } else {
            accessorType = "get";
        }

        return `${accessorType} ${data.Reference.Alias}`;
    }

    private resolveType(apiItem: Kind, extractedData: ExtractDto): Contracts.ApiType | undefined {
        let type: Contracts.ApiType | undefined;
        if (apiItem.ApiKind === Contracts.ApiItemKinds.GetAccessor) {
            // GetAccessor

            type = apiItem.Type;
        } else if (apiItem.Parameter != null) {
            // SetAccessor

            const apiParameter = extractedData.Registry[apiItem.Parameter.Ids[0]] as Contracts.ApiParameterDto;
            if (apiParameter != null) {
                type = apiParameter.Type;
            }
        }

        return type;
    }

    public Render(options: PluginOptions<Kind>): PluginResult {
        const heading = this.getHeading(options);
        const type = this.resolveType(options.ApiItem, options.ExtractedData);
        const pluginResult: PluginResult = {
            ...GeneratorHelpers.GetDefaultPluginResultData(),
            ApiItem: options.ApiItem,
            Reference: options.Reference,
            Headings: [
                {
                    ApiItemId: options.Reference.Id,
                    Heading: heading
                }
            ],
            UsedReferences: [options.Reference.Id]
        };

        // Header
        pluginResult.Result = new MarkdownBuilder()
            .Header(heading, 3)
            .EmptyLine()
            .Text(GeneratorHelpers.RenderApiItemMetadata(options.ApiItem))
            .Code(GeneratorHelpers.ApiAccessorToString(
                options.ExtractedData, 
                options.ApiItem,
                type,
                options.Reference.Alias
            ), GeneratorHelpers.DEFAULT_CODE_OPTIONS)
            .GetOutput();

        // Type
        const typeResult = this.RenderType(options.ExtractedData, type);
        GeneratorHelpers.MergePluginResultData(pluginResult, typeResult);

        return pluginResult;
    }
}
