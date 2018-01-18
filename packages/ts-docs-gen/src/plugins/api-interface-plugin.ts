import { Contracts } from "ts-extractor";
import { MarkdownBuilder } from "@simplrjs/markdown";

import {
    SupportedApiItemKindType,
    PluginResult,
    PluginOptions,
    PluginResultData
} from "../contracts/plugin";
import { GeneratorHelpers } from "../generator-helpers";
import { ApiInterface } from "../api-items/definitions/api-interface";
import { ApiTypes } from "../api-items/api-type-list";
import { ContainerPlugin, ContainerMembersKindsGroup } from "../abstractions/container-plugin";
import { ApiDefinitions } from "../api-items/api-definition-list";
import { ApiProperty } from "../api-items/definitions/api-property";

export class ApiInterfacePlugin extends ContainerPlugin<Contracts.ApiInterfaceDto> {
    public SupportedApiItemKinds(): SupportedApiItemKindType[] {
        return [GeneratorHelpers.ApiItemKinds.Interface];
    }

    public static readonly MemberKindsList: ContainerMembersKindsGroup[] = [
        {
            Heading: "Construct",
            Kinds: [Contracts.ApiItemKinds.Construct]
        },
        {
            Heading: "Call",
            Kinds: [Contracts.ApiItemKinds.Call]
        },
        {
            Heading: "Index",
            Kinds: [Contracts.ApiItemKinds.Index]
        },
        {
            Heading: "Method",
            Kinds: [Contracts.ApiItemKinds.Method]
        }
    ];

    private renderConstraintTypes(extendsItems: ApiTypes[]): PluginResultData | undefined {
        if (extendsItems.length === 0) {
            return undefined;
        }

        const builder = new MarkdownBuilder()
            .EmptyLine()
            .Bold("Extends");

        const references: string[] = [];

        for (const type of extendsItems) {
            // FIXME:
            //references.push(...typeDto.References);
            builder
                .EmptyLine()
                .Text(type.ToText().join(" "));
        }

        return {
            ...GeneratorHelpers.GetDefaultPluginResultData(),
            UsedReferences: references,
            Result: builder.GetOutput(),
        };
    }

    private renderPropertyMembers(members: ApiDefinitions[]): PluginResultData | undefined {
        const properties: ApiProperty[] = members
            .filter((x): x is ApiProperty => x.Data.ApiKind === Contracts.ApiItemKinds.Property);

        if (properties.length === 0) {
            return undefined;
        }
        const pluginResult = GeneratorHelpers.GetDefaultPluginResultData();

        const headers = ["Name", "Type", "Optional"];
        const content = properties
            .map(x => [x.Data.Name, x.Type.ToText().join(" "), String(x.Data.IsOptional)]);

        pluginResult.Result = new MarkdownBuilder()
            .EmptyLine()
            .Bold("Properties")
            .EmptyLine()
            .Table(headers, content, { removeColumnIfEmpty: true, removeRowIfEmpty: true })
            .GetOutput();

        return pluginResult;
    }

    public Render(options: PluginOptions, apiItem: Contracts.ApiInterfaceDto): PluginResult {
        const serializedApiItem = new ApiInterface(options.ExtractedData, apiItem, options.Reference);

        const heading = serializedApiItem.ToHeadingText();
        const pluginResult: PluginResult = {
            ...GeneratorHelpers.GetDefaultPluginResultData(),
            ApiItem: apiItem,
            Reference: options.Reference,
            Headings: [
                {
                    ApiItemId: options.Reference.Id,
                    Heading: heading
                }
            ],
            UsedReferences: [options.Reference.Id]
        };

        pluginResult.Result = new MarkdownBuilder()
            .Header(heading, 3)
            .EmptyLine()
            .Text(GeneratorHelpers.RenderApiItemMetadata(apiItem))
            .Code(serializedApiItem.ToText(), GeneratorHelpers.DEFAULT_CODE_OPTIONS)
            .GetOutput();

        // Type parameters
        const typeParametersResult = this.RenderTypeParameters(serializedApiItem.TypeParameters);
        GeneratorHelpers.MergePluginResultData(pluginResult, typeParametersResult);

        // Constraint types
        const constraintTypesResult = this.renderConstraintTypes(serializedApiItem.Extends);
        GeneratorHelpers.MergePluginResultData(pluginResult, constraintTypesResult);

        // Members
        const membersResult = this.RenderMembersGroups(
            options,
            ApiInterfacePlugin.MemberKindsList,
            serializedApiItem.Members,
            false,
            4,
            false
        );
        GeneratorHelpers.MergePluginResultData(pluginResult, membersResult);

        // Property items
        const propertyMembersResult = this.renderPropertyMembers(serializedApiItem.Members);
        GeneratorHelpers.MergePluginResultData(pluginResult, propertyMembersResult);

        return pluginResult;
    }
}
