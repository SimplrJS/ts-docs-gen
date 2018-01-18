import { Contracts, ExtractDto } from "ts-extractor";
import { LogLevel } from "simplr-logger";
import { MarkdownBuilder, Contracts as MarkdownContracts } from "@simplrjs/markdown";
import * as path from "path";

import { ApiItemReference } from "./contracts/api-item-reference";
import { ApiItemKindsAdditional, PluginResultData } from "./contracts/plugin";
import { Logger } from "./utils/logger";
import { SerializedApiDefinitionConstructor, SerializedApiTypeConstructor } from "./contracts/serialized-api-item";
import { ApiDefinitionList, ApiDefinitions } from "./api-items/api-definition-list";
import { ApiTypeList, ApiTypes } from "./api-items/api-type-list";
import { ApiDefinitionDefault } from "./api-items/api-definition-default";
import { ApiTypeDefault } from "./api-items/api-type-default";

export namespace GeneratorHelpers {
    export function SerializeApiDefinition<TKind extends Contracts.ApiBaseItemDto>(
        extractedData: ExtractDto,
        apiItem: TKind,
        reference: ApiItemReference
    ): ApiDefinitions {
        if (apiItem != null) {
            for (const [kind, constructorItem] of ApiDefinitionList) {
                if (kind === apiItem.ApiKind) {
                    const $constructor: SerializedApiDefinitionConstructor<TKind> = constructorItem;

                    return new $constructor(extractedData, apiItem, reference);
                }
            }
        }

        // TODO: Add logger: "This kind is not supported".
        return new ApiDefinitionDefault(extractedData, apiItem, reference);
    }

    export function SerializeApiType(extractedData: ExtractDto, apiType: Contracts.ApiType): ApiTypes {
        if (apiType != null) {
            for (const [kind, constructorItem] of ApiTypeList) {
                if (kind === apiType.ApiTypeKind) {
                    const $constructor: SerializedApiTypeConstructor<Contracts.ApiType> = constructorItem;

                    return new $constructor(extractedData, apiType);
                }
            }
        }

        // TODO: Add logger: "This kind is not supported".
        return new ApiTypeDefault(extractedData, apiType);
    }
    export type TypeToStringDto = ReferenceDto<string>;

    export interface ReferenceDto<T = string | string[]> {
        References: string[];
        Text: T;
    }

    export enum JSDocTags {
        Beta = "beta",
        Deprecated = "deprecated",
        Internal = "internal",
        Summary = "summary"
    }

    // #region Defaults and constants

    export const MARKDOWN_EXT = ".md";

    export const ApiItemKinds: typeof ApiItemKindsAdditional & typeof Contracts.ApiItemKinds =
        Object.assign(ApiItemKindsAdditional, Contracts.ApiItemKinds);

    export const DEFAULT_CODE_OPTIONS = {
        lang: "typescript"
    };

    export const DEFAULT_TABLE_OPTIONS: MarkdownContracts.TableOptions = {
        removeColumnIfEmpty: true,
        removeRowIfEmpty: true
    };

    // #endregion Defaults and constants

    // #region General helpers

    export function GetApiItemKinds(): typeof Contracts.ApiItemKinds & typeof ApiItemKindsAdditional {
        return Object.assign(Contracts.ApiItemKinds, ApiItemKindsAdditional);
    }

    export function GetApiItemReferences(
        extractedData: ExtractDto,
        itemsReference: Contracts.ApiItemReference[]
    ): ApiItemReference[] {
        let overallReferences: ApiItemReference[] = [];

        for (const item of itemsReference) {
            for (const referenceId of item.Ids) {
                // Check if item is ExportSpecifier or ExportDeclaration.
                const apiItem = extractedData.Registry[referenceId];

                switch (apiItem.ApiKind) {
                    case Contracts.ApiItemKinds.Export: {
                        if (apiItem.SourceFileId != null) {
                            const sourceFileReference = { Alias: apiItem.Name, Ids: [apiItem.SourceFileId] };
                            const referencesList = GetApiItemReferences(extractedData, [sourceFileReference]);
                            overallReferences = overallReferences.concat(referencesList);
                        }
                        break;
                    }
                    case Contracts.ApiItemKinds.ImportSpecifier:
                    case Contracts.ApiItemKinds.ExportSpecifier: {
                        if (apiItem.ApiItems == null) {
                            LogWithApiItemPosition(
                                LogLevel.Warning,
                                apiItem,
                                `ApiItems are missing in "${apiItem.Name}"?`
                            );
                            break;
                        }

                        const apiItemReference = { Alias: apiItem.Name, Ids: apiItem.ApiItems };
                        const referencesList = GetApiItemReferences(extractedData, [apiItemReference]);
                        overallReferences = overallReferences.concat(referencesList);
                        break;
                    }
                    case Contracts.ApiItemKinds.SourceFile: {
                        if (apiItem.Members == null) {
                            LogWithApiItemPosition(
                                LogLevel.Warning,
                                apiItem,
                                "Members are missing"
                            );
                        }

                        const referencesList = GetApiItemReferences(extractedData, apiItem.Members);
                        overallReferences = overallReferences.concat(referencesList);
                        break;
                    }
                    default: {
                        overallReferences.push({
                            Id: referenceId,
                            Alias: item.Alias
                        });
                    }
                }
            }
        }

        return overallReferences;
    }

    export function GetApiItemsFromReferenceList<T extends Contracts.ApiItemDto>(
        extractedData: ExtractDto,
        items: Contracts.ApiItemReference[],
        apiItemKind?: Contracts.ApiItemKinds
    ): T[] {
        const apiItems: T[] = [];

        for (const itemReferences of items) {
            apiItems.push(...GetApiItemsFromReference<T>(extractedData, itemReferences, apiItemKind));
        }

        return apiItems;
    }

    export function GetApiItemsFromReference<T extends Contracts.ApiItemDto>(
        extractedData: ExtractDto,
        reference: Contracts.ApiItemReference,
        apiItemKind?: Contracts.ApiItemKinds
    ): T[] {
        const apiItems: T[] = [];
        for (const referenceId of reference.Ids) {
            const apiItem = extractedData.Registry[referenceId] as T;
            if (apiItemKind == null || apiItemKind != null && apiItem.ApiKind === apiItemKind) {
                apiItems.push(apiItem);
            }
        }

        return apiItems;
    }

    export function LogWithApiItemPosition(logLevel: LogLevel, apiItem: Contracts.ApiItemDto, message: string): void {
        const { FileName, Line, Character } = apiItem.Location;
        const linePrefix = `${FileName}[${Line}:${Character + 1}]`;
        Logger.Log(logLevel, `${linePrefix}: ${message}`);
    }

    export function StandardisePath(pathString: string): string {
        return pathString.split(path.sep).join("/");
    }

    export function IsApiItemKind<TKindDto extends Contracts.ApiItemDto>(
        itemKind: Contracts.ApiItemKinds,
        apiItem: Contracts.ApiItemDto): apiItem is TKindDto {
        return apiItem.ApiKind === itemKind;
    }

    export function MergePluginResultData<T extends PluginResultData>(a: T, b: Partial<PluginResultData> | undefined): T {
        if (b == null) {
            return a;
        }

        a.Headings = a.Headings.concat(b.Headings || []);
        a.Members = (a.Members || []).concat(b.Members || []);
        a.Result = a.Result.concat(b.Result || []);
        a.UsedReferences = a.UsedReferences.concat(b.UsedReferences || []);

        return a;
    }

    export function GetDefaultPluginResultData<TKind = Contracts.ApiItemDto>(): PluginResultData<TKind> {
        return {
            Headings: [],
            Result: [],
            UsedReferences: [],
            Members: []
        };
    }
    // #endregion General helpers

    // #region Render helpers

    export function RenderApiItemMetadata(apiItem: Contracts.ApiItemDto): string[] {
        const builder = new MarkdownBuilder();

        // Optimise?
        const isBeta = apiItem.Metadata.JSDocTags.findIndex(x => x.name.toLowerCase() === JSDocTags.Beta) !== -1;
        const deprecated = apiItem.Metadata.JSDocTags.find(x => x.name.toLowerCase() === JSDocTags.Deprecated);
        const internal = apiItem.Metadata.JSDocTags.find(x => x.name.toLowerCase() === JSDocTags.Internal);
        const summary = apiItem.Metadata.JSDocTags.find(x => x.name.toLowerCase() === JSDocTags.Summary);
        const jSDocComment = apiItem.Metadata.DocumentationComment;

        if (isBeta) {
            builder
                .Text(`<span style="color: #d2d255;">Warning: Beta!</span>`)
                .EmptyLine();
        }

        if (deprecated != null) {
            const message = Boolean(deprecated.text) ? `: ${deprecated.text}` : "";
            builder
                .Text(`<span style="color: red;">Deprecated${message}!</span>`)
                .EmptyLine();
        }

        if (internal != null) {
            const message = Boolean(internal.text) ? `: ${internal.text}` : "";
            builder
                .Bold(`Internal${message}`)
                .EmptyLine();
        }

        if (jSDocComment.length > 0) {
            builder
                .Text(jSDocComment)
                .EmptyLine();
        }

        if (summary != null && Boolean(summary.text)) {
            builder
                .Blockquote(summary.text!.split("\n"))
                .EmptyLine();
        }

        return builder.GetOutput();
    }

    const TAB_STRING = "    ";

    export function Tab(size: number = 1): string {
        let result: string = "";
        for (let i = 0; i < size; i++) {
            result += TAB_STRING;
        }
        return result;
    }

    export function EnsureFullStop(sentence: string, punctuationMark: string = "."): string {
        const trimmedSentence = sentence.trim();
        const punctuationMarks = ".!:;,-";

        const lastSymbol = trimmedSentence[trimmedSentence.length - 1];

        if (punctuationMarks.indexOf(lastSymbol) !== -1) {
            return trimmedSentence;
        }

        return trimmedSentence + punctuationMark;
    }

    // #endregion Render helpers

    // #region Stringifiers

    export interface ApiItemObject extends Contracts.ApiBaseItemDto {
        Members: Contracts.ApiItemReference[];
    }
    // #endregion Stringifiers

    // #region Tables
    // export function ApiPropertiesToTableString(
    //     extractedData: ExtractDto,
    //     properties: Contracts.ApiPropertyDto[]
    // ): ReferenceDto<string[]> {
    //     const headers = ["Name", "Type", "Optional"];

    //     return ApiItemsToTableString<Contracts.ApiPropertyDto>(
    //         headers,
    //         properties,
    //         x => ApiPropertyToTableRow(extractedData, x)
    //     );
    // }

    // export function ApiPropertyToTableRow(extractedData: ExtractDto, property: Contracts.ApiPropertyDto): ReferenceDto<string[]> {
    //     const parameterTypeDto = ApiTypeToString(extractedData, property.Type);
    //     const isOptionalString = property.IsOptional ? "Yes" : "";

    //     return {
    //         Text: [property.Name, parameterTypeDto, isOptionalString],
    //         References: [] // FIXME: parameterTypeDto.References
    //     };
    // }

    // export function ApiParametersToTableString(
    //     extractedData: ExtractDto, 
    //     parameters: Contracts.ApiParameterDto[]
    // ): ReferenceDto<string[]> {
    //     const headers = ["Name", "Type", "Optional", "Initial value", "Description"];
    //     return ApiItemsToTableString<Contracts.ApiParameterDto>(
    //         headers,
    //         parameters,
    //         x => ApiParameterToTableRow(extractedData, x)
    //     );
    // }

    // // TODO: implement description.
    // // TODO: implement IsSpread.
    // export function ApiParameterToTableRow(extractedData: ExtractDto, parameter: Contracts.ApiParameterDto): ReferenceDto<string[]> {
    //     const parameterTypeDto = ApiTypeToString(extractedData, parameter.Type);
    //     const isOptionalString = parameter.IsOptional ? "Yes" : "";
    //     const initializerString = parameter.Initializer || "";

    //     return {
    //         Text: [parameter.Name, MarkdownGenerator.EscapeString(parameterTypeDto), isOptionalString, initializerString],
    //         References: [] // FIXME: parameterTypeDto.References
    //     };
    // }

    // export function ApiTypeParametersTableToString(
    //     extractedData: ExtractDto,
    //     typeParameters: Contracts.ApiTypeParameterDto[]
    // ): ReferenceDto<string[]> {
    //     const headers = ["Name", "Constraint type", "Default type"];
    //     return ApiItemsToTableString<Contracts.ApiTypeParameterDto>(
    //         headers,
    //         typeParameters,
    //         x => ApiTypeParameterToTableRow(extractedData, x)
    //     );
    // }

    // // TODO: add description from @template jsdoc tag.
    // export function ApiTypeParameterToTableRow(
    //     extractedData: ExtractDto,
    //     typeParameter: Contracts.ApiTypeParameterDto
    // ): ReferenceDto<string[]> {
    //     const referenceIds: string[] = [];
    //     let constraintType: string = "";
    //     let defaultType: string = "";

    //     if (typeParameter.ConstraintType) {
    //         const parsedConstraintType = ApiTypeToString(extractedData, typeParameter.ConstraintType);

    //         // FIXME: referenceIds = referenceIds.concat(parsedConstraintType.References);
    //         constraintType = MarkdownGenerator.EscapeString(parsedConstraintType);
    //     }

    //     if (typeParameter.DefaultType) {
    //         const parsedDefaultType = ApiTypeToString(extractedData, typeParameter.DefaultType);

    //         // FIXME: referenceIds = referenceIds.concat(parsedDefaultType.References);
    //         defaultType = MarkdownGenerator.EscapeString(parsedDefaultType);
    //     }

    //     return {
    //         Text: [typeParameter.Name, constraintType, defaultType],
    //         References: referenceIds
    //     };
    // }

    // export function ApiItemsToTableString<TApiDto extends Contracts.ApiItemDto>(
    //     headers: string[],
    //     items: TApiDto[],
    //     itemToString: (item: TApiDto) => ReferenceDto<string[]>
    // ): ReferenceDto<string[]> {
    //     if (items.length === 0) {
    //         return {
    //             References: [],
    //             Text: []
    //         };
    //     }

    //     const rows = items.map(itemToString);
    //     const content = rows.map(row => row.Text);
    //     const referenceIds = Helpers.Flatten(rows.map(row => row.References));

    //     return {
    //         Text: MarkdownGenerator.Table(headers, content, DEFAULT_TABLE_OPTIONS),
    //         References: referenceIds
    //     };
    // }

    // #endregion Tables
}
