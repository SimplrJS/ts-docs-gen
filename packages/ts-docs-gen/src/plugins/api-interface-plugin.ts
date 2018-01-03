import { Contracts } from "ts-extractor";
import { MarkdownBuilder, MarkdownGenerator } from "@simplrjs/markdown";
import {
    Plugin,
    SupportedApiItemKindType,
    PluginResult,
    PluginOptions,
    GetItemPluginResultHandler,
    PluginResultData
} from "../contracts/plugin";
import { GeneratorHelpers } from "../generator-helpers";
import { ApiItemReference } from "../contracts/api-item-reference";

interface ExtractedItemDto<TApiItemDto extends Contracts.ApiItemDto = Contracts.ApiItemDto> {
    Reference: ApiItemReference;
    ApiItem: TApiItemDto;
}

export class ApiInterfacePlugin implements Plugin<Contracts.ApiInterfaceDto> {
    public SupportedApiItemKinds(): SupportedApiItemKindType[] {
        return [GeneratorHelpers.ApiItemKinds.Interface];
    }

    public CheckApiItem(item: Contracts.ApiInterfaceDto): boolean {
        return true;
    }

    private renderTypeParameters(pluginOptions: PluginOptions<Contracts.ApiInterfaceDto>): PluginResultData | undefined {
        const typeParameters = GeneratorHelpers.GetApiItemsFromReference<Contracts.ApiTypeParameterDto>(
            pluginOptions.ApiItem.TypeParameters,
            pluginOptions.ExtractedData
        );

        if (typeParameters.length === 0) {
            return undefined;
        }

        const typeParametersTable = GeneratorHelpers.ApiTypeParametersTableToString(typeParameters);
        const text = new MarkdownBuilder()
            .EmptyLine()
            .Bold("Type parameters")
            .EmptyLine()
            .Text(typeParametersTable.Text)
            .GetOutput();

        return {
            Result: text,
            UsedReferences: typeParametersTable.References,
            Headings: []
        };
    }

    private renderConstraintTypes(apiItem: Contracts.ApiInterfaceDto): PluginResultData | undefined {
        if (apiItem.Extends.length === 0) {
            return undefined;
        }

        const builder = new MarkdownBuilder()
            .EmptyLine()
            .Bold("Extends");

        const references = [];

        for (const type of apiItem.Extends) {
            const typeDto = GeneratorHelpers.TypeDtoToMarkdownString(type);
            references.push(...typeDto.References);
            builder
                .EmptyLine()
                .Text(typeDto.Text);
        }

        return {
            UsedReferences: references,
            Result: builder.GetOutput(),
            Headings: []
        };
    }

    private renderPropertyMembers(memberItems: ExtractedItemDto[]): PluginResultData | undefined {
        const apiItems = memberItems.filter<ExtractedItemDto<Contracts.ApiPropertyDto>>(
            this.isReferenceOfApiItemKind.bind(undefined, Contracts.ApiItemKinds.Property)
        ).map(x => x.ApiItem);

        if (apiItems.length === 0) {
            return undefined;
        }

        const table = GeneratorHelpers.ApiPropertiesToTableString(apiItems);
        const builder = new MarkdownBuilder()
            .EmptyLine()
            .Header("Properties", 4)
            .EmptyLine()
            .Text(table.Text);

        return {
            UsedReferences: table.References,
            Result: builder.GetOutput(),
            Headings: []
        };
    }

    private isReferenceOfApiItemKind<TKindDto extends Contracts.ApiItemDto>(
        itemKind: Contracts.ApiItemKinds,
        extractedItem: ExtractedItemDto<TKindDto>
    ): extractedItem is ExtractedItemDto<TKindDto> {
        return extractedItem.ApiItem.ApiKind === itemKind;
    }

    private renderMemberItemsGroup(
        title: string,
        apiItemKind: Contracts.ApiItemKinds,
        memberItems: ExtractedItemDto[],
        getPluginResult: GetItemPluginResultHandler
    ): PluginResultData | undefined {
        const items = memberItems.filter<ExtractedItemDto>(this.isReferenceOfApiItemKind.bind(undefined, apiItemKind));

        if (items.length === 0) {
            return undefined;
        }

        const pluginResult = GeneratorHelpers.GetDefaultPluginResultData();
        pluginResult.Result.push("", MarkdownGenerator.Header(title, 4));

        for (const item of items) {
            pluginResult.Result.push("");
            const itemPluginResult = getPluginResult(item.Reference);

            GeneratorHelpers.MergePluginResultData(pluginResult, itemPluginResult);
        }

        return pluginResult;
    }

    public Render(data: PluginOptions<Contracts.ApiInterfaceDto>): PluginResult {
        const heading = data.Reference.Alias;
        const pluginResult: PluginResult = {
            ...GeneratorHelpers.GetDefaultPluginResultData(),
            ApiItem: data.ApiItem,
            Reference: data.Reference,
            Headings: [
                {
                    ApiItemId: data.Reference.Id,
                    Heading: heading
                }
            ]
        };

        const memberReferences = GeneratorHelpers.GetApiItemReferences(data.ExtractedData, data.ApiItem.Members);
        const memberItems = memberReferences.map<ExtractedItemDto>(itemReference => ({
            Reference: itemReference,
            ApiItem: data.ExtractedData.Registry[itemReference.Id]
        }));

        const interfaceString = GeneratorHelpers.ApiInterfaceToString(data.ApiItem, data.ExtractedData);
        const builder = new MarkdownBuilder()
            .Header(heading, 3)
            .EmptyLine()
            .Text(GeneratorHelpers.RenderApiItemMetadata(data.ApiItem))
            .Code(interfaceString, GeneratorHelpers.DEFAULT_CODE_OPTIONS);

        pluginResult.Result = builder.GetOutput();

        // Type parameters
        const typeParametersResult = this.renderTypeParameters(data);
        GeneratorHelpers.MergePluginResultData(pluginResult, typeParametersResult);

        // Constraint types
        const constraintTypesResult = this.renderConstraintTypes(data.ApiItem);
        GeneratorHelpers.MergePluginResultData(pluginResult, constraintTypesResult);

        // Construct items
        const constructMembersResult = this.renderMemberItemsGroup(
            "Construct",
            Contracts.ApiItemKinds.Construct,
            memberItems,
            data.GetItemPluginResult
        );
        GeneratorHelpers.MergePluginResultData(pluginResult, constructMembersResult);

        // Call items
        const callMembersResult = this.renderMemberItemsGroup(
            "Call",
            Contracts.ApiItemKinds.Call,
            memberItems,
            data.GetItemPluginResult
        );
        GeneratorHelpers.MergePluginResultData(pluginResult, callMembersResult);

        // Index items
        const indexMembersResult = this.renderMemberItemsGroup(
            "Index signatures",
            Contracts.ApiItemKinds.Index,
            memberItems,
            data.GetItemPluginResult
        );
        GeneratorHelpers.MergePluginResultData(pluginResult, indexMembersResult);

        // Method items
        const methodMembersResult = this.renderMemberItemsGroup(
            "Methods",
            Contracts.ApiItemKinds.Method,
            memberItems,
            data.GetItemPluginResult
        );
        GeneratorHelpers.MergePluginResultData(pluginResult, methodMembersResult);

        // Property items
        const propertyMembersResult = this.renderPropertyMembers(memberItems);
        GeneratorHelpers.MergePluginResultData(pluginResult, propertyMembersResult);

        return pluginResult;
    }
}
