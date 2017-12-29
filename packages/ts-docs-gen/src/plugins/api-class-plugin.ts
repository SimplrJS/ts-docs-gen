import { Contracts } from "ts-extractor";
import { MarkdownBuilder } from "@simplrjs/markdown";
import * as path from "path";

import { GeneratorHelpers } from "../generator-helpers";
import {
    Plugin,
    SupportedApiItemKindType,
    PluginOptions,
    PluginResult,
    PluginResultData
} from "../contracts/plugin";

export class ApiClassPlugin implements Plugin<Contracts.ApiClassDto> {
    public SupportedApiItemKinds(): SupportedApiItemKindType[] {
        return [GeneratorHelpers.ApiItemKinds.Class];
    }

    public CheckApiItem(item: Contracts.ApiItemDto): boolean {
        return true;
    }

    private renderMembers(data: PluginOptions<Contracts.ApiClassDto>): PluginResultData {
        const references = GeneratorHelpers.GetApiItemReferences(data.ExtractedData, data.ApiItem.Members);
        const renderedItems = references.map(x => data.GetItemPluginResult(x));
        const pluginResultData = GeneratorHelpers.GetDefaultPluginResultData();
        const builder = new MarkdownBuilder();

        const list: Array<[Contracts.ApiItemKinds, string]> = [
            [Contracts.ApiItemKinds.Index, "Index"],
            [Contracts.ApiItemKinds.ClassConstructor, "Constructor"],
            [Contracts.ApiItemKinds.ClassMethod, "Methods"],
            [Contracts.ApiItemKinds.ClassProperty, "Properties"]
        ];

        for (const [kind, heading] of list) {
            const pluginResultsByKind = renderedItems.filter(x => x.ApiItem.ApiKind === kind);

            if (pluginResultsByKind.length > 0) {
                builder
                    .Header(heading, 2)
                    .EmptyLine();

                for (const item of pluginResultsByKind) {
                    GeneratorHelpers.MergePluginResultData(pluginResultData, item);

                    builder
                        .Text(item.Result)
                        .EmptyLine();
                }
            }
        }

        pluginResultData.Result = builder.GetOutput();
        return pluginResultData;
    }

    public Render(data: PluginOptions<Contracts.ApiClassDto>): PluginResult {
        const typeParameters = GeneratorHelpers
            .GetApiItemsFromReference<Contracts.ApiTypeParameterDto>(data.ApiItem.TypeParameters, data.ExtractedData);

        const pluginResult: PluginResult = {
            ApiItem: data.ApiItem,
            Reference: data.Reference,
            ...GeneratorHelpers.GetDefaultPluginResultData()
        };
        const heading = path.basename(data.ApiItem.Name, path.extname(data.ApiItem.Name));
        pluginResult.Headings = [
            {
                Heading: heading,
                ApiItemId: data.Reference.Id
            }
        ];

        // Header
        const builder = new MarkdownBuilder()
            .Header(heading, 1)
            .EmptyLine()
            .Text(GeneratorHelpers.RenderApiItemMetadata(data.ApiItem))
            .Code(GeneratorHelpers.ClassToString(
                data.ApiItem,
                typeParameters,
                data.Reference.Alias
            ), GeneratorHelpers.DEFAULT_CODE_OPTIONS);
        pluginResult.Result = builder.GetOutput();

        // ApiMembers
        const members = this.renderMembers(data);
        GeneratorHelpers.MergePluginResultData(pluginResult, members);

        return pluginResult;
    }
}
