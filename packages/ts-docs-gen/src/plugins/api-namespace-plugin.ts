import { Contracts } from "ts-extractor";
import { MarkdownBuilder } from "@simplrjs/markdown";
import * as path from "path";

import { GeneratorHelpers } from "../generator-helpers";
import { SupportedApiItemKindType, PluginOptions, PluginResult } from "../contracts/plugin";
import { ContainerPlugin, ContainerMembersKindsGroup } from "../abstractions/container-plugin";

export class ApiNamespacePlugin extends ContainerPlugin<Contracts.ApiNamespaceDto> {
    public SupportedApiItemKinds(): SupportedApiItemKindType[] {
        return [GeneratorHelpers.ApiItemKinds.Namespace];
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

    public Render(options: PluginOptions<Contracts.ApiNamespaceDto>): PluginResult {
        const heading = path.basename(options.ApiItem.Name, path.extname(options.ApiItem.Name));
        const pluginResult: PluginResult = {
            ...GeneratorHelpers.GetDefaultPluginResultData(),
            ApiItem: options.ApiItem,
            Reference: options.Reference,
            UsedReferences: [options.Reference.Id]
        };

        // Header
        pluginResult.Result = new MarkdownBuilder()
            .Header(heading, 1)
            .EmptyLine()
            .Text(GeneratorHelpers.RenderApiItemMetadata(options.ApiItem))
            .GetOutput();

        // Members
        const membersResult = this.RenderMembersGroups(ApiNamespacePlugin.MemberKindsList, options);

        // Treat members' headings as members of namespace heading.
        const membersHeadings = membersResult.Headings;

        // Clearing headings from members result to prevent repeated inclusion.
        membersResult.Headings = [];

        pluginResult.Headings.push({
            Heading: heading,
            ApiItemId: options.Reference.Id,
            Members: membersHeadings
        });

        // Merging rest of the members result
        GeneratorHelpers.MergePluginResultData(pluginResult, membersResult);

        return pluginResult;
    }
}
