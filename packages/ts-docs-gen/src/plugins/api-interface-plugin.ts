import { Contracts, ExtractDto } from "ts-extractor";
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
            Kinds: [GeneratorHelpers.ApiItemKinds.Construct]
        },
        {
            Heading: "Call",
            Kinds: [GeneratorHelpers.ApiItemKinds.Call]
        },
        {
            Heading: "Index",
            Kinds: [GeneratorHelpers.ApiItemKinds.Index]
        },
        {
            Heading: "Method",
            Kinds: [GeneratorHelpers.ApiItemKinds.Method]
        }
    ];

    private renderConstraintTypes(extractedData: ExtractDto, extendsItems: ApiTypes[]): PluginResultData | undefined {
        if (extendsItems.length === 0) {
            return undefined;
        }

        const builder = new MarkdownBuilder()
            .EmptyLine()
            .Bold("Extends");

        const references: string[] = [];

        for (const type of extendsItems) {
            builder
                .EmptyLine()
                .Text(type.ToInlineText(this.RenderReferences(extractedData, references)));
        }

        return {
            ...GeneratorHelpers.GetDefaultPluginResultData(),
            UsedReferences: references,
            Result: builder.GetOutput(),
        };
    }

    private renderPropertyMembers(extractedData: ExtractDto, members: ApiDefinitions[]): PluginResultData | undefined {
        const properties: ApiProperty[] = members
            .filter((x): x is ApiProperty => x.ApiItem.ApiKind === Contracts.ApiItemKinds.Property);

        if (properties.length === 0) {
            return undefined;
        }
        const pluginResult = GeneratorHelpers.GetDefaultPluginResultData();

        const headers = ["Name", "Type", "Optional"];
        const content = properties
            .map(x => [
                x.Name,
                x.Type.ToInlineText(this.RenderReferences(extractedData, pluginResult.UsedReferences)),
                String(x.ApiItem.IsOptional)
            ]);

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
            .Text(this.RenderApiItemMetadata(apiItem))
            .Code(serializedApiItem.ToText(), GeneratorHelpers.DEFAULT_CODE_OPTIONS)
            .GetOutput();

        // Type parameters
        const typeParametersResult = this.RenderTypeParameters(options.ExtractedData, serializedApiItem.TypeParameters);
        GeneratorHelpers.MergePluginResultData(pluginResult, typeParametersResult);

        // Constraint types
        const constraintTypesResult = this.renderConstraintTypes(options.ExtractedData, serializedApiItem.Extends);
        GeneratorHelpers.MergePluginResultData(pluginResult, constraintTypesResult);

        // Members
        const membersResult = this.RenderMemberGroups(
            options,
            ApiInterfacePlugin.MemberKindsList,
            serializedApiItem.Members,
            {
                IncludeHr: false,
                StartingHeadingLevel: 4
            }
        );
        GeneratorHelpers.MergePluginResultData(pluginResult, membersResult);

        // Property items
        const propertyMembersResult = this.renderPropertyMembers(options.ExtractedData, serializedApiItem.Members);
        GeneratorHelpers.MergePluginResultData(pluginResult, propertyMembersResult);

        return pluginResult;
    }
}
