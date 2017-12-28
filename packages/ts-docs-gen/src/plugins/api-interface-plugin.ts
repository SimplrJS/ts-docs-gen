import { Contracts } from "ts-extractor";
import { MarkdownBuilder } from "@simplrjs/markdown";
import {
    Plugin,
    SupportedApiItemKindType,
    PluginResult,
    PluginOptions,
    PluginHeading,
    GetItemPluginResultHandler
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

    private resolveTypeParameters(typeParameters: Contracts.ApiTypeParameterDto[]): GeneratorHelpers.ReferenceDto<string[]> {
        if (typeParameters.length === 0) {
            return { Text: [], References: [] };
        }

        const typeParametersTable = GeneratorHelpers.ApiTypeParametersTableToString(typeParameters);
        const text = new MarkdownBuilder()
            .Header("Type parameters", 3)
            .EmptyLine()
            .Text(typeParametersTable.Text)
            .EmptyLine()
            .GetOutput();

        return {
            Text: text,
            References: typeParametersTable.References
        };
    }

    private resolveConstraintTypes(apiItem: Contracts.ApiInterfaceDto): GeneratorHelpers.ReferenceDto<string[]> {
        if (apiItem.Extends.length === 0) {
            return {
                References: [],
                Text: []
            };
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

        return {
            References: references,
            Text: builder.GetOutput()
        };
    }

    private renderConstructMembers(
        items: Array<ExtractedItemDto<Contracts.ApiConstructDto>>,
        getPluginResult: GetItemPluginResultHandler
    ): GeneratorHelpers.ReferenceDto<string[]> {
        if (items.length === 0) {
            return {
                References: [],
                Text: []
            };
        }

        const references: string[] = [];
        const builder = new MarkdownBuilder()
            .Header("Construct", 3)
            .EmptyLine();

        for (const item of items) {
            const pluginResult = getPluginResult(item.Reference);
            references.push(...pluginResult.UsedReferences);
            builder
                .Text(pluginResult.Result)
                .EmptyLine()
                .HorizontalRule()
                .EmptyLine();
        }

        return {
            References: references,
            Text: builder.GetOutput()
        };
    }

    private renderCallMembers(
        items: Array<ExtractedItemDto<Contracts.ApiCallDto>>,
        getPluginResult: GetItemPluginResultHandler
    ): GeneratorHelpers.ReferenceDto<string[]> {
        if (items.length === 0) {
            return {
                References: [],
                Text: []
            };
        }

        const references: string[] = [];
        const builder = new MarkdownBuilder()
            .Header("Call", 3)
            .EmptyLine();

        for (const item of items) {
            const pluginResult = getPluginResult(item.Reference);
            references.push(...pluginResult.UsedReferences);
            builder
                .Text(pluginResult.Result)
                .EmptyLine()
                .HorizontalRule()
                .EmptyLine();
        }

        return {
            References: references,
            Text: builder.GetOutput()
        };
    }

    private renderIndexMembers(
        items: Array<ExtractedItemDto<Contracts.ApiIndexDto>>,
        getPluginResult: GetItemPluginResultHandler
    ): GeneratorHelpers.ReferenceDto<string[]> {
        if (items.length === 0) {
            return {
                References: [],
                Text: []
            };
        }

        const references: string[] = [];
        const builder = new MarkdownBuilder()
            .Header("Index signatures", 3)
            .EmptyLine();

        for (const item of items) {
            const pluginResult = getPluginResult(item.Reference);
            references.push(...pluginResult.UsedReferences);
            builder
                .Text(pluginResult.UsedReferences)
                .EmptyLine()
                .HorizontalRule()
                .EmptyLine();
        }

        return {
            References: references,
            Text: builder.GetOutput()
        };
    }

    private renderMethodMembers(
        items: Array<ExtractedItemDto<Contracts.ApiMethodDto>>,
        getPluginResult: GetItemPluginResultHandler
    ): GeneratorHelpers.ReferenceDto<string[]> {
        if (items.length === 0) {
            return {
                References: [],
                Text: []
            };
        }

        const references: string[] = [];
        const builder = new MarkdownBuilder()
            .Header("Methods", 3)
            .EmptyLine();

        for (const item of items) {
            const pluginResult = getPluginResult(item.Reference);
            references.push(...pluginResult.Result);
            builder
                .Text(pluginResult.Result)
                .EmptyLine()
                .HorizontalRule()
                .EmptyLine();
        }

        return {
            References: references,
            Text: builder.GetOutput()
        };
    }

    private renderPropertyMembers(apiItems: Contracts.ApiPropertyDto[]): GeneratorHelpers.ReferenceDto<string[]> {
        if (apiItems.length === 0) {
            return {
                References: [],
                Text: []
            };
        }

        const table = GeneratorHelpers.ApiPropertiesToTableString(apiItems);
        const builder = new MarkdownBuilder()
            .Header("Properties", 3)
            .EmptyLine()
            .Text(table.Text);

        return {
            References: table.References,
            Text: builder.GetOutput()
        };
    }

    private isReferenceOfApiItemKind<TKindDto extends Contracts.ApiItemDto>(
        itemKind: Contracts.ApiItemKinds,
        extractedItem: ExtractedItemDto<TKindDto>
    ): extractedItem is ExtractedItemDto<TKindDto> {
        return extractedItem.ApiItem.ApiKind === itemKind;
    }

    public Render(data: PluginOptions<Contracts.ApiInterfaceDto>): PluginResult {
        const alias = data.Reference.Alias;
        const headings: PluginHeading[] = [
            {
                ApiItemId: data.Reference.Id,
                Heading: alias
            }
        ];

        const typeParameters = GeneratorHelpers.GetApiItemsFromReference<Contracts.ApiTypeParameterDto>(
            data.ApiItem.TypeParameters,
            data.ExtractedData
        );

        const resolvedTypeParameters = this.resolveTypeParameters(typeParameters);
        const resolvedConstraintTypes = this.resolveConstraintTypes(data.ApiItem);

        const memberReferences = GeneratorHelpers.GetApiItemReferences(data.ExtractedData, data.ApiItem.Members);

        const memberItems = memberReferences.map<ExtractedItemDto>(itemReference => ({
            Reference: itemReference,
            ApiItem: data.ExtractedData.Registry[itemReference.Id]
        }));

        const constructItems = memberItems.filter<ExtractedItemDto<Contracts.ApiConstructDto>>(
            this.isReferenceOfApiItemKind.bind(undefined, Contracts.ApiItemKinds.Construct)
        );
        const renderedConstructMembers = this.renderConstructMembers(constructItems, data.GetItemPluginResult);

        const callItems = memberItems.filter<ExtractedItemDto<Contracts.ApiCallDto>>(
            this.isReferenceOfApiItemKind.bind(undefined, Contracts.ApiItemKinds.Call)
        );
        const renderedCallMembers = this.renderCallMembers(callItems, data.GetItemPluginResult);

        const indexItems = memberItems.filter<ExtractedItemDto<Contracts.ApiIndexDto>>(
            this.isReferenceOfApiItemKind.bind(undefined, Contracts.ApiItemKinds.Index)
        );
        const renderedIndexMembers = this.renderIndexMembers(indexItems, data.GetItemPluginResult);

        const methodItems = memberItems.filter<ExtractedItemDto<Contracts.ApiMethodDto>>(
            this.isReferenceOfApiItemKind.bind(undefined, Contracts.ApiItemKinds.Method)
        );
        const renderedMethodMembers = this.renderMethodMembers(methodItems, data.GetItemPluginResult);

        const propertyMembers = memberItems.filter<ExtractedItemDto<Contracts.ApiPropertyDto>>(
            this.isReferenceOfApiItemKind.bind(undefined, Contracts.ApiItemKinds.Property)
        ).map(x => x.ApiItem);

        const renderedPropertyMembers = this.renderPropertyMembers(propertyMembers);

        const interfaceString = GeneratorHelpers.ApiInterfaceToString(
            data.ApiItem,
            typeParameters,
            constructItems.map(x => x.ApiItem),
            callItems.map(x => x.ApiItem),
            indexItems.map(x => x.ApiItem),
            methodItems.map(x => x.ApiItem),
            propertyMembers,
            data.ExtractedData
        );

        const builder = new MarkdownBuilder()
            .Header(GeneratorHelpers.ApiInterfaceToSimpleString(alias, data.ApiItem), 2)
            .EmptyLine()
            .Text(GeneratorHelpers.RenderApiItemMetadata(data.ApiItem))
            .Code(interfaceString, GeneratorHelpers.DEFAULT_CODE_OPTIONS)
            .EmptyLine()
            .Text(resolvedConstraintTypes.Text)
            .Text(resolvedTypeParameters.Text)
            .Text(renderedConstructMembers.Text)
            .Text(renderedCallMembers.Text)
            .Text(renderedIndexMembers.Text)
            .Text(renderedMethodMembers.Text)
            .Text(renderedPropertyMembers.Text);

        return {
            ApiItem: data.ApiItem,
            Reference: data.Reference,
            Headings: headings,
            UsedReferences: [
                ...resolvedTypeParameters.References,
                ...resolvedConstraintTypes.References,
                ...renderedConstructMembers.References,
                ...renderedConstructMembers.References,
                ...renderedIndexMembers.References,
                ...renderedMethodMembers.References,
                ...renderedPropertyMembers.References
            ],
            Result: builder.GetOutput()
        };
    }
}
