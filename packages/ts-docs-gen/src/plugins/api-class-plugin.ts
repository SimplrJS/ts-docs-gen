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

interface RenderMembers {
    Heading: string;
    Kinds: Contracts.ApiItemKinds[];
}

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

        const list: RenderMembers[] = [
            {
                Heading: "Index",
                Kinds: [Contracts.ApiItemKinds.Index]
            },
            {
                Heading: "Constructor",
                Kinds: [Contracts.ApiItemKinds.ClassConstructor]
            },
            {
                Heading: "Methods",
                Kinds: [Contracts.ApiItemKinds.ClassMethod]
            },
            {
                Heading: "Properties",
                Kinds: [
                    Contracts.ApiItemKinds.ClassProperty,
                    Contracts.ApiItemKinds.GetAccessor,
                    Contracts.ApiItemKinds.SetAccessor,
                ]
            }
        ];

        for (const memberKind of list) {
            const pluginResultsByKind = renderedItems.filter(x => memberKind.Kinds.indexOf(x.ApiItem.ApiKind) !== -1);

            if (pluginResultsByKind.length > 0) {
                builder
                    .Header(memberKind.Heading, 2)
                    .EmptyLine();

                for (const member of pluginResultsByKind) {
                    GeneratorHelpers.MergePluginResultData(pluginResultData, member);

                    builder
                        .Text(member.Result)
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
