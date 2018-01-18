import { Contracts } from "ts-extractor";
import { MarkdownBuilder } from "@simplrjs/markdown";

import { GeneratorHelpers } from "../generator-helpers";
import { SupportedApiItemKindType, PluginOptions, PluginResult } from "../contracts/plugin";
import { ContainerPlugin, ContainerMembersKindsGroup } from "../abstractions/container-plugin";
import { ApiSourceFile } from "../api-items/definitions/api-source-file";

export class ApiSourceFilePlugin extends ContainerPlugin<Contracts.ApiSourceFileDto> {
    public SupportedApiItemKinds(): SupportedApiItemKindType[] {
        return [GeneratorHelpers.ApiItemKinds.SourceFile];
    }

    public static readonly MemberKindsList: ContainerMembersKindsGroup[] = [
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
            Kinds: [Contracts.ApiItemKinds.TypeAlias]
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

    public Render(options: PluginOptions, apiItem: Contracts.ApiSourceFileDto): PluginResult {
        const serializedApiItem = new ApiSourceFile(options.ExtractedData, apiItem, options.Reference);

        const heading = serializedApiItem.ToHeadingText();
        const pluginResult: PluginResult = {
            ...GeneratorHelpers.GetDefaultPluginResultData(),
            ApiItem: apiItem,
            Reference: options.Reference,
            UsedReferences: [options.Reference.Id]
        };


        // Header
        pluginResult.Result = new MarkdownBuilder()
            .Header(heading, 1)
            .EmptyLine()
            .Text(this.RenderApiItemMetadata(apiItem))
            .GetOutput();

        // Members
        const membersResult = this.RenderMembersGroups(options, ApiSourceFilePlugin.MemberKindsList, serializedApiItem.Members);

        // Treat members' headings as members of source file heading.
        const membersHeadings = membersResult.Headings;

        // Clearing headings from members result to prevent repeated inclusion.
        membersResult.Headings = [];

        pluginResult.Headings.push({
            Heading: heading,
            ApiItemId: options.Reference.Id,
            Members: membersHeadings,
        });

        // Merging rest of the members result
        GeneratorHelpers.MergePluginResultData(pluginResult, membersResult);

        return pluginResult;
    }
}
