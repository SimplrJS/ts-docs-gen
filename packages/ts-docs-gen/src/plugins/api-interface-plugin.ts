import { Contracts } from "ts-extractor";
// import { MarkdownBuilder, MarkdownGenerator } from "@simplrjs/markdown";

import {
    SupportedApiItemKindType,
    PluginResult,
    PluginOptions,
    // GetItemPluginResultHandler,
    // PluginResultData
} from "../contracts/plugin";
import { GeneratorHelpers } from "../generator-helpers";
// import { ApiItemReference } from "../contracts/api-item-reference";
import { BasePlugin } from "../abstractions/base-plugin";
// import { ApiInterface } from "../api-items/definitions/api-interface";

// interface ExtractedItemDto<TApiItemDto extends Contracts.ApiItemDto = Contracts.ApiItemDto> {
//     Reference: ApiItemReference;
//     ApiItem: TApiItemDto;
// }

export class ApiInterfacePlugin extends BasePlugin<Contracts.ApiInterfaceDto> {
    public SupportedApiItemKinds(): SupportedApiItemKindType[] {
        return [GeneratorHelpers.ApiItemKinds.Interface];
    }

    // private renderConstraintTypes(extractedData: ExtractDto, apiItem: Contracts.ApiInterfaceDto): PluginResultData | undefined {
    //     if (apiItem.Extends.length === 0) {
    //         return undefined;
    //     }

    //     const builder = new MarkdownBuilder()
    //         .EmptyLine()
    //         .Bold("Extends");

    //     const references: string[] = [];

    //     for (const type of apiItem.Extends) {
    //         const typeDto = GeneratorHelpers.ApiTypeToString(extractedData, type);
    //         // FIXME:
    //         //references.push(...typeDto.References);
    //         builder
    //             .EmptyLine()
    //             .Text(typeDto);
    //     }

    //     return {
    //         ...GeneratorHelpers.GetDefaultPluginResultData(),
    //         UsedReferences: references,
    //         Result: builder.GetOutput(),
    //     };
    // }

    // private renderPropertyMembers(extractedData: ExtractDto, memberItems: ExtractedItemDto[]): PluginResultData | undefined {
    //     const apiItems = memberItems.filter<ExtractedItemDto<Contracts.ApiPropertyDto>>(
    //         this.isReferenceOfApiItemKind.bind(undefined, Contracts.ApiItemKinds.Property)
    //     ).map(x => x.ApiItem);

    //     if (apiItems.length === 0) {
    //         return undefined;
    //     }

    //     const table = GeneratorHelpers.ApiPropertiesToTableString(extractedData, apiItems);
    //     const builder = new MarkdownBuilder()
    //         .EmptyLine()
    //         .Bold("Properties")
    //         .EmptyLine()
    //         .Text(table.Text);

    //     return {
    //         ...GeneratorHelpers.GetDefaultPluginResultData(),
    //         UsedReferences: table.References,
    //         Result: builder.GetOutput(),
    //     };
    // }

    // private isReferenceOfApiItemKind<TKindDto extends Contracts.ApiItemDto>(
    //     itemKind: Contracts.ApiItemKinds,
    //     extractedItem: ExtractedItemDto<TKindDto>
    // ): extractedItem is ExtractedItemDto<TKindDto> {
    //     return extractedItem.ApiItem.ApiKind === itemKind;
    // }

    // private renderMemberItemsGroup(
    //     title: string,
    //     apiItemKind: Contracts.ApiItemKinds,
    //     memberItems: ExtractedItemDto[],
    //     getPluginResult: GetItemPluginResultHandler
    // ): PluginResultData | undefined {
    //     const items = memberItems.filter<ExtractedItemDto>(this.isReferenceOfApiItemKind.bind(undefined, apiItemKind));

    //     if (items.length === 0) {
    //         return undefined;
    //     }

    //     const pluginResult = GeneratorHelpers.GetDefaultPluginResultData();
    //     pluginResult.Result.push("", MarkdownGenerator.Header(title, 4));

    //     for (const item of items) {
    //         pluginResult.Result.push("");
    //         const itemPluginResult = getPluginResult(item.Reference);

    //         GeneratorHelpers.MergePluginResultData(pluginResult, itemPluginResult);
    //     }

    //     return pluginResult;
    // }

    public Render(options: PluginOptions, apiItem: Contracts.ApiInterfaceDto): PluginResult {
        const heading = options.Reference.Alias;
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

        // const serializedApiItem = new ApiInterface(options.ExtractedData, apiItem, options.Reference);

        // const memberReferences = GeneratorHelpers.GetApiItemReferences(options.ExtractedData, apiItem.Members);
        // const memberItems = memberReferences.map<ExtractedItemDto>(itemReference => ({
        //     Reference: itemReference,
        //     ApiItem: options.ExtractedData.Registry[itemReference.Id]
        // }));

        // const interfaceString = GeneratorHelpers.ApiInterfaceToString(options.ExtractedData, options.ApiItem);
        // const builder = new MarkdownBuilder()
        //     .Header(heading, 3)
        //     .EmptyLine()
        //     .Text(GeneratorHelpers.RenderApiItemMetadata(options.ApiItem))
        //     .Code(interfaceString, GeneratorHelpers.DEFAULT_CODE_OPTIONS);

        // pluginResult.Result = builder.GetOutput();

        // // Type parameters
        // const apiTypeParameters = GeneratorHelpers
        //     .GetApiItemsFromReferenceList<Contracts.ApiTypeParameterDto>(options.ExtractedData, options.ApiItem.TypeParameters);
        // const typeParametersResult = this.RenderTypeParameters(options.ExtractedData, apiTypeParameters);
        // GeneratorHelpers.MergePluginResultData(pluginResult, typeParametersResult);

        // // Constraint types
        // const constraintTypesResult = this.renderConstraintTypes(options.ExtractedData, options.ApiItem);
        // GeneratorHelpers.MergePluginResultData(pluginResult, constraintTypesResult);

        // // Construct items
        // const constructMembersResult = this.renderMemberItemsGroup(
        //     "Construct",
        //     Contracts.ApiItemKinds.Construct,
        //     memberItems,
        //     options.GetItemPluginResult
        // );
        // GeneratorHelpers.MergePluginResultData(pluginResult, constructMembersResult);

        // // Call items
        // const callMembersResult = this.renderMemberItemsGroup(
        //     "Call",
        //     Contracts.ApiItemKinds.Call,
        //     memberItems,
        //     options.GetItemPluginResult
        // );
        // GeneratorHelpers.MergePluginResultData(pluginResult, callMembersResult);

        // // Index items
        // const indexMembersResult = this.renderMemberItemsGroup(
        //     "Index signatures",
        //     Contracts.ApiItemKinds.Index,
        //     memberItems,
        //     options.GetItemPluginResult
        // );
        // GeneratorHelpers.MergePluginResultData(pluginResult, indexMembersResult);

        // // Method items
        // const methodMembersResult = this.renderMemberItemsGroup(
        //     "Methods",
        //     Contracts.ApiItemKinds.Method,
        //     memberItems,
        //     options.GetItemPluginResult
        // );
        // GeneratorHelpers.MergePluginResultData(pluginResult, methodMembersResult);

        // // Property items
        // const propertyMembersResult = this.renderPropertyMembers(options.ExtractedData, memberItems);
        // GeneratorHelpers.MergePluginResultData(pluginResult, propertyMembersResult);

        return pluginResult;
    }
}
