import { Contracts } from "ts-extractor";
import { MarkdownBuilder } from "@simplrjs/markdown";

import { GeneratorHelpers } from "../generator-helpers";
import { SupportedApiItemKindType, PluginOptions, PluginResult } from "../contracts/plugin";
import { ContainerPlugin, ContainerMembersKindsGroup } from "../abstractions/container-plugin";
import { ApiClass } from "../api-items/definitions/api-class";

export class ApiClassPlugin extends ContainerPlugin<Contracts.ApiClassDto> {
    public SupportedApiDefinitionKind(): SupportedApiItemKindType[] {
        return [GeneratorHelpers.ApiDefinitionKind.Class];
    }

    public static readonly MemberKindsList: ContainerMembersKindsGroup[] = [
        {
            Heading: "Index",
            Kinds: [GeneratorHelpers.ApiDefinitionKind.Index]
        },
        {
            Heading: "Constructor",
            Kinds: [GeneratorHelpers.ApiDefinitionKind.ClassConstructor]
        },
        {
            Heading: "Methods",
            Kinds: [GeneratorHelpers.ApiDefinitionKind.ClassMethod]
        },
        {
            Heading: "Properties",
            Kinds: [
                GeneratorHelpers.ApiDefinitionKind.ClassProperty,
                GeneratorHelpers.ApiDefinitionKind.GetAccessor,
                GeneratorHelpers.ApiDefinitionKind.SetAccessor,
            ]
        },
        {
            Heading: "Other",
            Kinds: [
                GeneratorHelpers.ApiDefinitionKind.Any
            ]
        }
    ];

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

        // TypeParameters
        const typeParametersResult = this.RenderTypeParameters(options.ExtractedData, serializedApiItem.TypeParameters);
        GeneratorHelpers.MergePluginResultData(pluginResult, typeParametersResult);

        // ApiMembers
        const membersResult = this.RenderMemberGroups(options, ApiClassPlugin.MemberKindsList, serializedApiItem.Members);

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
