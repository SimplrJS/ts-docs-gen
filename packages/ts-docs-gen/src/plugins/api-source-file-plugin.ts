import { Contracts } from "ts-extractor";
import { MarkdownBuilder } from "@simplrjs/markdown";

import { GeneratorHelpers } from "../generator-helpers";
import { SupportedApiItemKindType, PluginOptions, PluginResult } from "../contracts/plugin";
import { ContainerPlugin, ContainerMembersKindsGroup } from "../abstractions/container-plugin";
import { ApiSourceFile } from "../api-items/definitions/api-source-file";

export class ApiSourceFilePlugin extends ContainerPlugin<Contracts.ApiSourceFileDto> {
    public SupportedApiDefinitionKind(): SupportedApiItemKindType[] {
        return [GeneratorHelpers.ApiDefinitionKind.SourceFile];
    }

    public static readonly MemberKindsList: ContainerMembersKindsGroup[] = [
        {
            Heading: "Functions",
            Kinds: [GeneratorHelpers.ApiDefinitionKind.Function]
        },
        {
            Heading: "Interfaces",
            Kinds: [GeneratorHelpers.ApiDefinitionKind.Interface]
        },
        {
            Heading: "Types",
            Kinds: [GeneratorHelpers.ApiDefinitionKind.TypeAlias]
        },
        {
            Heading: "Enums",
            Kinds: [GeneratorHelpers.ApiDefinitionKind.Enum]
        },
        {
            Heading: "Classes",
            Kinds: [GeneratorHelpers.ApiDefinitionKind.Class]
        },
        {
            Heading: "Namespaces",
            Kinds: [GeneratorHelpers.ApiDefinitionKind.Namespace]
        },
        {
            Heading: "Variables",
            Kinds: [GeneratorHelpers.ApiDefinitionKind.Variable]
        },
        {
            Heading: "Other",
            Kinds: [GeneratorHelpers.ApiDefinitionKind.Any]
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
        const membersResult = this.RenderMemberGroups(options, ApiSourceFilePlugin.MemberKindsList, serializedApiItem.Members);

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
