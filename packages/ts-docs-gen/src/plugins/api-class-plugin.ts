import { Contracts } from "ts-extractor";
import { MarkdownBuilder } from "@simplrjs/markdown";

import { GeneratorHelpers } from "../generator-helpers";
import { SupportedApiItemKindType, PluginOptions, PluginResult } from "../contracts/plugin";
import { ContainerPlugin, ContainerMembersKindsGroup } from "../abstractions/container-plugin";
import { ApiClass } from "../api-items/definitions/api-class";

export class ApiClassPlugin extends ContainerPlugin<Contracts.ApiClassDto> {
    public SupportedApiItemKinds(): SupportedApiItemKindType[] {
        return [GeneratorHelpers.ApiItemKinds.Class];
    }

    public static readonly MemberKindsList: ContainerMembersKindsGroup[] = [
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

    // TODO: Add TypeParameters render.
    public Render(options: PluginOptions, apiItem: Contracts.ApiClassDto): PluginResult {
        const serializedApiItem = new ApiClass(options.ExtractedData, apiItem, options.Reference);

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
            .Code(serializedApiItem.ToText(), GeneratorHelpers.DEFAULT_CODE_OPTIONS)
            .GetOutput();

        // ApiMembers
        const membersResult = this.RenderMembersGroups(options, ApiClassPlugin.MemberKindsList, serializedApiItem.Members);

        // Treat members' headings as members of class heading.
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
