import { Contracts, ExtractDto } from "ts-extractor";
import { Plugin, SupportedApiItemKindType, PluginOptions, PluginResult, PluginResultData } from "../contracts/plugin";
import { GeneratorHelpers } from "../generator-helpers";
import { MarkdownBuilder } from "@simplrjs/markdown";

export type Kind = Contracts.ApiSetAccessorDto | Contracts.ApiGetAccessorDto;

export class ApiClassAccessorPlugin implements Plugin<Kind> {
    public SupportedApiItemKinds(): SupportedApiItemKindType[] {
        return [
            GeneratorHelpers.ApiItemKinds.GetAccessor,
            GeneratorHelpers.ApiItemKinds.SetAccessor,
        ];
    }

    public CheckApiItem(item: Kind): boolean {
        return true;
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

    private resolveType(apiItem: Kind, extractedData: ExtractDto): Contracts.TypeDto | undefined {
        // Resolve type
        let type: Contracts.TypeDto | undefined;
        if (apiItem.ApiKind === Contracts.ApiItemKinds.GetAccessor) {
            type = apiItem.Type;
        } else if (apiItem.Parameter != null) {
            const apiParameter = extractedData.Registry[apiItem.Parameter.Ids[0]] as Contracts.ApiParameterDto;
            if (apiParameter != null) {
                type = apiParameter.Type;
            }
        }

        return type;
    }

    private renderTypeDto(type: Contracts.TypeDto | undefined): Partial<PluginResultData> | undefined {
        if (type == null) {
            return undefined;
        }

        const result = GeneratorHelpers.TypeDtoToMarkdownString(type);

        const builder = new MarkdownBuilder()
            .EmptyLine()
            .Header("Type", 4)
            .EmptyLine()
            .Text(result.Text);

        return {
            Result: builder.GetOutput(),
            UsedReferences: result.References
        };
    }

    public Render(data: PluginOptions<Kind>): PluginResult {
        const heading = this.getHeading(data);
        const type = this.resolveType(data.ApiItem, data.ExtractedData);
        const pluginResult: PluginResult = {
            ...GeneratorHelpers.GetDefaultPluginResultData(),
            ApiItem: data.ApiItem,
            Reference: data.Reference,
            Headings: [
                {
                    ApiItemId: data.Reference.Id,
                    Heading: heading
                }
            ]
        };

        pluginResult.Result = new MarkdownBuilder()
            .Header(heading, 3)
            .EmptyLine()
            .Text(GeneratorHelpers.RenderApiItemMetadata(data.ApiItem))
            .Code(GeneratorHelpers.ApiAccessorToString(data.ApiItem, type, data.Reference.Alias), GeneratorHelpers.DEFAULT_CODE_OPTIONS)
            .GetOutput();

        // Type
        const typeResult = this.renderTypeDto(type);
        GeneratorHelpers.MergePluginResultData(pluginResult, typeResult);

        return pluginResult;
    }
}
