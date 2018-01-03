import { Contracts } from "ts-extractor";
import { MarkdownBuilder } from "@simplrjs/markdown";
import * as path from "path";

import { GeneratorHelpers } from "../generator-helpers";
import { SupportedApiItemKindType, PluginOptions, PluginResult } from "../contracts/plugin";
import { ContainerPlugin, ContainerRenderMembers } from "../abstractions/container-plugin";

export class ApiSourceFilePlugin extends ContainerPlugin<Contracts.ApiSourceFileDto> {
    public SupportedApiItemKinds(): SupportedApiItemKindType[] {
        return [GeneratorHelpers.ApiItemKinds.SourceFile];
    }

    public Render(data: PluginOptions<Contracts.ApiSourceFileDto>): PluginResult {
        const heading = path.basename(data.ApiItem.Name, path.extname(data.ApiItem.Name));
        const pluginResult: PluginResult = {
            ...GeneratorHelpers.GetDefaultPluginResultData(),
            ApiItem: data.ApiItem,
            Reference: data.Reference,
            Headings: [
                {
                    Heading: heading,
                    ApiItemId: data.Reference.Id
                }
            ]
        };

        // Header
        pluginResult.Result = new MarkdownBuilder()
            .Header(heading, 1)
            .EmptyLine()
            .Text(GeneratorHelpers.RenderApiItemMetadata(data.ApiItem))
            .GetOutput();

        // Members
        const memberKindsList: ContainerRenderMembers[] = [
            {
                Heading: "Functions",
                Kinds: [Contracts.ApiItemKinds.Function]
            },
            {
                Heading: "Interfaces",
                Kinds: [Contracts.ApiItemKinds.Interface]
            },
            {
                Heading: "Types",
                Kinds: [Contracts.ApiItemKinds.Type]
            },
            {
                Heading: "Enums",
                Kinds: [Contracts.ApiItemKinds.Enum]
            },
            {
                Heading: "Classes",
                Kinds: [Contracts.ApiItemKinds.Class]
            },
            {
                Heading: "Namespaces",
                Kinds: [Contracts.ApiItemKinds.Namespace]
            },
            {
                Heading: "Variables",
                Kinds: [Contracts.ApiItemKinds.Variable]
            }
        ];
        const members = this.RenderMembers(memberKindsList, data);
        GeneratorHelpers.MergePluginResultData(pluginResult, members);

        return pluginResult;
    }
}
