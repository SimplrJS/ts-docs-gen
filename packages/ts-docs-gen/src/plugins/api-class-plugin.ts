import { Contracts } from "ts-extractor";
import { MarkdownBuilder } from "@simplrjs/markdown";
import * as path from "path";

import { GeneratorHelpers } from "../generator-helpers";
import { SupportedApiItemKindType, PluginOptions, PluginResult } from "../contracts/plugin";
import { ContainerPlugin, ContainerMembersKindsGroup } from "../abstractions/container-plugin";

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

    public Render(options: PluginOptions<Contracts.ApiClassDto>): PluginResult {
        const heading = path.basename(options.ApiItem.Name, path.extname(options.ApiItem.Name));
        const pluginResult: PluginResult = {
            ...GeneratorHelpers.GetDefaultPluginResultData(),
            ApiItem: options.ApiItem,
            Reference: options.Reference,
            UsedReferences: [options.Reference.Id]
        };

        // Resolve ApiItems from references.
        const typeParameters = GeneratorHelpers
            .GetApiItemsFromReference<Contracts.ApiTypeParameterDto>(options.ApiItem.TypeParameters, options.ExtractedData);

        // Header
        pluginResult.Result = new MarkdownBuilder()
            .Header(heading, 1)
            .EmptyLine()
            .Text(GeneratorHelpers.RenderApiItemMetadata(options.ApiItem))
            .Code(GeneratorHelpers.ClassToString(
                options.ApiItem,
                typeParameters,
                options.Reference.Alias
            ), GeneratorHelpers.DEFAULT_CODE_OPTIONS)
            .GetOutput();

        // ApiMembers
        const members = this.RenderMembersGroups(ApiClassPlugin.MemberKindsList, options);
        GeneratorHelpers.MergePluginResultData(pluginResult, members);

        pluginResult.Headings.push({
            Heading: heading,
            ApiItemId: options.Reference.Id,
            Members: this.HeadingMembers
        });

        return pluginResult;
    }
}
