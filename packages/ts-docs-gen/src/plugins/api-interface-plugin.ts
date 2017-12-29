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

    private renderTypeParameters(pluginOptions: PluginOptions<Contracts.ApiInterfaceDto>): PluginResultData {
        const typeParameters = GeneratorHelpers.GetApiItemsFromReference<Contracts.ApiTypeParameterDto>(
            pluginOptions.ApiItem.TypeParameters,
            pluginOptions.ExtractedData
        );

        if (typeParameters.length === 0) {
            return GeneratorHelpers.GetDefaultPluginResultData();
        }

        const typeParametersTable = GeneratorHelpers.ApiTypeParametersTableToString(typeParameters);
        const text = new MarkdownBuilder()
            .Header("Type parameters", 3)
            .EmptyLine()
            .Text(typeParametersTable.Text)
            .EmptyLine()
            .GetOutput();

        // TODO: Should I put type parameter heading here?
        return {
            Result: text,
            UsedReferences: typeParametersTable.References,
            Headings: []
        };
    }

    private renderConstraintTypes(apiItem: Contracts.ApiInterfaceDto): PluginResultData {
        if (apiItem.Extends.length === 0) {
            return GeneratorHelpers.GetDefaultPluginResultData();
        }

        const builder = new MarkdownBuilder()
            .Header("Extends", 3)
            .EmptyLine();

        const references = [];

        for (const type of apiItem.Extends) {
            const typeDto = GeneratorHelpers.TypeDtoToMarkdownString(type);
            references.push(...typeDto.References);

            builder
                .Text(typeDto.Text)
                .EmptyLine();
        }

        // TODO: should Extends header be added to Headings?
        return {
            UsedReferences: references,
            Result: builder.GetOutput(),
            Headings: []
        };
    }

    private renderPropertyMembers(memberItems: ExtractedItemDto[]): PluginResultData {
        const apiItems = memberItems.filter<ExtractedItemDto<Contracts.ApiPropertyDto>>(
            this.isReferenceOfApiItemKind.bind(undefined, Contracts.ApiItemKinds.Property)
        ).map(x => x.ApiItem);

        if (apiItems.length === 0) {
            return GeneratorHelpers.GetDefaultPluginResultData();
        }

        const table = GeneratorHelpers.ApiPropertiesToTableString(apiItems);
        const builder = new MarkdownBuilder()
            .Header("Properties", 3)
            .EmptyLine()
            .Text(table.Text);

        // TODO: should I put Properties heading to Headers?
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
    ): PluginResultData {
        const items = memberItems.filter<ExtractedItemDto>(this.isReferenceOfApiItemKind.bind(undefined, apiItemKind));

        if (items.length === 0) {
            return GeneratorHelpers.GetDefaultPluginResultData();
        }

        const pluginResult = GeneratorHelpers.GetDefaultPluginResultData();
        pluginResult.Result.push(MarkdownGenerator.Header(title, 3), "");

        for (const item of items) {
            const itemPluginResult = getPluginResult(item.Reference);

            GeneratorHelpers.MergePluginResultData(pluginResult, itemPluginResult);
            pluginResult.Result.push("", MarkdownGenerator.HorizontalRule(), "");
        }

        return pluginResult;
    }

    public Render(data: PluginOptions<Contracts.ApiInterfaceDto>): PluginResult {
        const alias = data.Reference.Alias;
        const pluginResult: PluginResult = {
            ...GeneratorHelpers.GetDefaultPluginResultData(),
            ApiItem: data.ApiItem,
            Reference: data.Reference,
            Headings: [
                {
                    ApiItemId: data.Reference.Id,
                    Heading: alias
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
            .Header(GeneratorHelpers.ApiInterfaceToSimpleString(alias, data.ApiItem), 2)
            .EmptyLine()
            .Text(GeneratorHelpers.RenderApiItemMetadata(data.ApiItem))
            .Code(interfaceString, GeneratorHelpers.DEFAULT_CODE_OPTIONS)
            .EmptyLine();

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
