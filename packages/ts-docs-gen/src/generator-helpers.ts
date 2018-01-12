import { Contracts, ExtractDto, TSHelpers } from "ts-extractor";
import { LogLevel } from "simplr-logger";
import { MarkdownGenerator, MarkdownBuilder, Contracts as MarkdownContracts } from "@simplrjs/markdown";
import * as path from "path";

import { ApiItemReference } from "./contracts/api-item-reference";
import { ApiItemKindsAdditional, PluginResultData } from "./contracts/plugin";
import { Logger } from "./utils/logger";
import { Helpers } from "./utils/helpers";

export namespace GeneratorHelpers {
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

    export function GetApiItemsFromReference<T extends Contracts.ApiItemDto>(
        items: Contracts.ApiItemReference[],
        extractedData: ExtractDto,
        apiItemKind?: Contracts.ApiItemKinds
    ): T[] {
        const apiItems: T[] = [];

        for (const itemReferences of items) {
            for (const referenceId of itemReferences.Ids) {
                const apiItem = extractedData.Registry[referenceId] as T;
                if (apiItemKind == null || apiItemKind != null && apiItem.ApiKind === apiItemKind) {
                    apiItems.push(apiItem);
                }
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

    export function FunctionTypeToString(apiItem: Contracts.ApiFunctionTypeDto, extractedData: ExtractDto): string {
        const typeParameters = GetApiItemsFromReference<Contracts.ApiTypeParameterDto>(apiItem.TypeParameters, extractedData);
        const parameters = GetApiItemsFromReference<Contracts.ApiParameterDto>(apiItem.Parameters, extractedData);

        return ApiCallToString(typeParameters, parameters, apiItem.ReturnType, " =>");
    }

    // TODO: WIP.
    export function ApiTypeToString(type: Contracts.ApiType, extractedData: ExtractDto): string {
        switch (type.ApiTypeKind) {
            case Contracts.ApiTypeKind.Array: {
                // Foo[]
                return `${ApiTypeToString(type.Type, extractedData)}[]`;
            }
            case Contracts.ApiTypeKind.Reference: {
                // Foo or Foo<string>
                return `${type.SymbolName}${_TypeParametersToString(type.TypeParameters, extractedData)}`;
            }
            case Contracts.ApiTypeKind.Union:
            case Contracts.ApiTypeKind.Intersection: {
                // string | number
                const character = type.ApiTypeKind === Contracts.ApiTypeKind.Union ? "|" : "&";
                const resolvedTypes = type.Members.map(x => ApiTypeToString(x, extractedData));

                return resolvedTypes.join(` ${character} `);
            }
            case Contracts.ApiTypeKind.Tuple: {
                // [string, number]
                const resolvedTypes = type.Members.map(x => ApiTypeToString(x, extractedData));
                return `[${resolvedTypes.join(", ")}]`;
            }
            case Contracts.ApiTypeKind.TypePredicate: {
                // arg is string
                return `${type.ParameterName} is ${ApiTypeToString(type.Type, extractedData)}`;
            }
            case Contracts.ApiTypeKind.IndexedAccess: {
                // Foo[T]
                return `${ApiTypeToString(type.ObjectType, extractedData)}[${type.IndexType.Text}]`;
            }
            // TODO: Fix this after ts-extractor update.
            // case Contracts.ApiTypeKind.FunctionType:
            case Contracts.ApiTypeKind.TypeLiteral:
            case Contracts.ApiTypeKind.Mapped:
            case Contracts.ApiTypeKind.This:
            case Contracts.ApiTypeKind.Constructor: {
                return _TypeLikeToString(type.ReferenceId, extractedData);
            }
            case Contracts.ApiTypeKind.TypeQuery: {
                // typeof Foo
                return `${type.Keyword} ${_TypeLikeToString(type.ReferenceId, extractedData)}`;
            }
            case Contracts.ApiTypeKind.TypeOperator: {
                // keyof Foo
                return `${type.Keyword} ${ApiTypeToString(type.Type, extractedData)}`;
            }
            case Contracts.ApiTypeKind.Parenthesized: {
                // (string | number)
                return `(${ApiTypeToString(type.Type, extractedData)})`;
            }
            case Contracts.ApiTypeKind.Basic: {
                return type.Text;
            }
        }

        // --
        return "???";
    }

    export function _TypeParametersToString(types: Contracts.ApiType[] | undefined, extractedData: ExtractDto): string {
        if (types == null) {
            return "";
        }
        const typesString = types.map(x => ApiTypeToString(x, extractedData));

        return `<${typesString.join(", ")}>`;
    }

    export function _TypeLikeToString(referenceId: string | undefined, extractedData: ExtractDto): string {
        if (referenceId == null) {
            // TODO: Add error of missing value.
            return "???";
        }

        const apiItem = extractedData.Registry[referenceId];

        switch (apiItem.ApiKind) {
            case Contracts.ApiItemKinds.FunctionType: {
                return FunctionTypeToString(apiItem, extractedData);
            }
            case Contracts.ApiItemKinds.TypeLiteral: {
                return ApiObjectToString(apiItem, extractedData)
                    .map(x => x.trim())
                    .join(" ");
            }
            default: {
                Logger.Warn(`"${apiItem.ApiKind}" is not supported.`);
                return "???";
            }
        }
    }

    // export function TypeDtoToString(type: Contracts.TypeDto, extractedData: ExtractDto): string {
    //     if (type.ReferenceId == null &&
    //         type.Text === type.Name) {
    //         return type.Text;
    //     }

    //     switch (type.ApiTypeKind) {
    //         case Contracts.TypeKinds.Union:
    //         case Contracts.TypeKinds.Intersection: {
    //             const separator = type.ApiTypeKind === Contracts.TypeKinds.Union ? "|" : "&";
    //             const result = type.Types
    //                 .map(x => TypeDtoToString(x, extractedData))
    //                 .join(` ${separator} `);

    //             return result;
    //         }
    //         case Contracts.TypeKinds.Basic:
    //         default: {
    //             let result: string = type.Name || type.Text;

    //             if (
    //                 type.Name != null &&
    //                 type.ReferenceId != null &&
    //                 TSHelpers.IsInternalSymbolName(type.Name)
    //             ) {
    //                 result = TypeLikeToString(type.ReferenceId, extractedData);
    //             }

    //             // Generics
    //             if (type.Name != null && type.Generics != null) {
    //                 const generics = type.Generics.map(x => TypeDtoToString(x, extractedData));

    //                 result += `\<${generics.join(", ")}\>`;
    //             }

    //             return result;
    //         }
    //     }
    // }

    // // TODO: implement type literal and function type.
    // export function TypeDtoToMarkdownString(type: Contracts.TypeDto): TypeToStringDto {
    //     let references: string[] = [];
    //     let text: string = "";

    //     switch (type.ApiTypeKind) {
    //         case Contracts.TypeKinds.Union:
    //         case Contracts.TypeKinds.Intersection: {
    //             const symbol = type.ApiTypeKind === Contracts.TypeKinds.Union ? "|" : "&";

    //             if (type.Name === type.Text) {
    //                 text = type.Text;
    //                 break;
    //             }

    //             if (type.ReferenceId != null) {
    //                 text = MarkdownGenerator.Link(type.Name || type.Text, type.ReferenceId, true);
    //                 references.push(type.ReferenceId);
    //                 break;
    //             }

    //             type.Types
    //                 .map(TypeDtoToMarkdownString)
    //                 .forEach(typeItem => {
    //                     references = references.concat(typeItem.References);

    //                     if (text === "") {
    //                         text = typeItem.Text;
    //                     } else {
    //                         text += ` ${symbol} ${typeItem.Text}`;
    //                     }
    //                 });
    //             break;
    //         }
    //         default: {
    //             // Basic type with reference.
    //             if (type.Name == null || TSHelpers.IsInternalSymbolName(type.Name)) {
    //                 text = type.Text;
    //             } else {
    //                 if (type.ApiTypeKind !== Contracts.TypeKinds.TypeParameter && type.ReferenceId != null) {
    //                     text = MarkdownGenerator.Link(type.Name || type.Text, type.ReferenceId, true);
    //                     references.push(type.ReferenceId);
    //                 } else {
    //                     text = type.Name || type.Text;
    //                 }
    //             }

    //             // Generics
    //             if (type.Name != null && type.Generics != null) {
    //                 const generics = type.Generics.map(TypeDtoToMarkdownString);
    //                 references = references.concat(...generics.map(x => x.References));

    //                 text += `&lt;${generics.map(x => x.Text).join(", ")}&gt;`;
    //             }
    //         }
    //     }

    //     return {
    //         References: references,
    //         Text: text
    //     };
    // }

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

    export function FixSentence(sentence: string, punctuationMark: string = "."): string {
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

    export function ApiObjectToString(apiItem: ApiItemObject, extractedData: ExtractDto, title?: string): string[] {
        const builder = new MarkdownBuilder()
            .Text(`${title != null ? title : ""} {`.trim());

        const constructMembers = GetApiItemsFromReference<Contracts.ApiConstructDto>(
            apiItem.Members,
            extractedData,
            Contracts.ApiItemKinds.Construct
        );
        constructMembers.forEach(member => {
            const parameters = GetApiItemsFromReference<Contracts.ApiParameterDto>(member.Parameters, extractedData);
            const memberTypeParameters = GetApiItemsFromReference<Contracts.ApiTypeParameterDto>(member.TypeParameters, extractedData);
            builder.Text(`${Tab(1)}${ApiConstructToString(memberTypeParameters, parameters, member.ReturnType)};`);
        });

        const callMembers = GetApiItemsFromReference<Contracts.ApiCallDto>(
            apiItem.Members,
            extractedData,
            Contracts.ApiItemKinds.Call
        );
        callMembers.forEach(member => {
            const parameters = GetApiItemsFromReference<Contracts.ApiParameterDto>(member.Parameters, extractedData);
            const memberTypeParameters = GetApiItemsFromReference<Contracts.ApiTypeParameterDto>(member.TypeParameters, extractedData);
            builder.Text(`${Tab(1)}${ApiCallToString(memberTypeParameters, parameters, member.ReturnType)};`);
        });

        const indexMembers = GetApiItemsFromReference<Contracts.ApiIndexDto>(
            apiItem.Members,
            extractedData,
            Contracts.ApiItemKinds.Index
        );
        indexMembers.forEach(member => {
            const parameter = extractedData.Registry[member.Parameter] as Contracts.ApiParameterDto;
            builder.Text(`${Tab(1)}${ApiIndexToString(parameter, member.Type, member.IsReadonly)};`);
        });

        const methodMembers = GetApiItemsFromReference<Contracts.ApiConstructDto>(
            apiItem.Members,
            extractedData,
            Contracts.ApiItemKinds.Method
        );
        methodMembers.forEach(member => {
            const parameters = GetApiItemsFromReference<Contracts.ApiParameterDto>(member.Parameters, extractedData);
            const memberTypeParameters = GetApiItemsFromReference<Contracts.ApiTypeParameterDto>(member.TypeParameters, extractedData);

            builder.Text(`${Tab(1)}${ApiMethodToString(member.Name, memberTypeParameters, parameters, member.ReturnType)};`);
        });

        const propertyMembers = GetApiItemsFromReference<Contracts.ApiPropertyDto>(
            apiItem.Members,
            extractedData,
            Contracts.ApiItemKinds.Property
        );
        propertyMembers.forEach(member => {
            builder.Text(`${Tab(1)}${ApiPropertyToString(member)};`);
        });

        builder.Text("}");

        return builder.GetOutput();
    }

    // TODO: optimize.
    export function ApiInterfaceToString(
        apiItem: Contracts.ApiInterfaceDto,
        extractedData: ExtractDto
    ): string[] {
        const typeParameters = GetApiItemsFromReference<Contracts.ApiTypeParameterDto>(apiItem.TypeParameters, extractedData);
        const typeParametersString = TypeParametersToString(typeParameters);

        let extendsString: string;

        if (apiItem.Extends.length === 0) {
            extendsString = "";
        } else {
            const typesExtended = apiItem.Extends
                .map(x => x.Text)
                .join(", ");
            extendsString = ` extends ${typesExtended}`;
        }

        const heading = `interface ${apiItem.Name}${typeParametersString}${extendsString}`;

        const builder = new MarkdownBuilder()
            .Text(ApiObjectToString(apiItem, extractedData, heading));

        return builder.GetOutput();
    }

    // TODO: FIX.
    export function ApiTypeAliasToString(name: string, type: Contracts.ApiType, extractedData: ExtractDto): string {
        //return `type ${name} = ${TypeDtoToString(type, extractedData)};`;
        return "type __type";
    }

    export function ApiInterfaceToSimpleString(alias: string, apiItem: Contracts.ApiInterfaceDto): string {
        const name = alias || apiItem.Name;
        return `interface ${name}`;
    }

    // TODO: Fix
    export function ApiIndexToString(parameter: Contracts.ApiParameterDto, type: Contracts.ApiType, readOnly: boolean = false): string {
        const typeString = "???"; //TypeDtoToMarkdownString(type).Text;
        const parameterTypeString = "???"; //TypeDtoToMarkdownString(parameter.Type).Text;

        const readOnlyString = readOnly ? "readonly " : "";

        return `${readOnlyString}[${parameter.Name}: ${parameterTypeString}]: ${typeString}`;
    }

    export function ApiPropertyToString(apiItem: Contracts.ApiPropertyDto): string {
        const optional = apiItem.IsOptional ? "?" : "";
        const readOnly = apiItem.IsReadonly ? "readonly " : "";

        return `${readOnly}${apiItem.Name}${optional}: ${apiItem.Type.Text}`;
    }

    export function ApiAccessorToString(
        apiItem: Contracts.ApiGetAccessorDto | Contracts.ApiSetAccessorDto,
        type: Contracts.ApiType | undefined,
        alias?: string
    ): string {
        const name = alias || apiItem.Name;
        const abstract = apiItem.IsAbstract ? " abstract" : "";
        const $static = apiItem.IsStatic ? " static" : "";

        const typeString = type != null ? type.Text : "???";
        let accessorType: string;
        if (apiItem.ApiKind === Contracts.ApiItemKinds.SetAccessor) {
            accessorType = "set";
        } else {
            accessorType = "get";
        }

        return `${apiItem.AccessModifier}${$static}${abstract} ${accessorType} ${name}: ${typeString};`;
    }

    export function ApiClassPropertyToString(apiItem: Contracts.ApiClassPropertyDto, alias?: string): string {
        const name = alias || apiItem.Name;

        const optional = apiItem.IsOptional ? "?" : "";
        const readOnly = apiItem.IsReadonly ? " readonly" : "";
        const abstract = apiItem.IsAbstract ? " abstract" : "";
        const $static = apiItem.IsStatic ? " static" : "";

        return `${apiItem.AccessModifier}${$static}${abstract}${readOnly} ${name}${optional}: ${apiItem.Type.Text};`;
    }

    export function ApiEnumToString(apiItem: Contracts.ApiEnumDto, memberItems: Contracts.ApiEnumMemberDto[], alias?: string): string[] {
        const name = alias || apiItem.Name;
        const $const = apiItem.IsConst ? "const " : "";

        // Constructing enum body.
        const membersStrings = memberItems.map((memberItem, index, array) => {
            // Add an enum name
            let memberString = `${GeneratorHelpers.Tab()} ${memberItem.Name}`;

            // Add an enum member value if it exists.
            if (memberItem.Value) {
                memberString += ` = ${memberItem.Value}`;
            }

            // Add a comma if current item is not the last item
            if (index !== memberItems.length - 1) {
                memberString += ",";
            }

            return memberString;
        });

        // Construct enum code output
        return [
            `${$const}enum ${name} {`,
            ...membersStrings,
            "}"
        ];
    }

    export function ApiVariableToString(item: Contracts.ApiVariableDto, alias?: string): string {
        const name = alias != null ? alias : item.Name;

        return `${item.VariableDeclarationType} ${name}: ${item.Type.Text};`;
    }

    export function ClassToString(
        apiItem: Contracts.ApiClassDto,
        typeParameters?: Contracts.ApiTypeParameterDto[],
        alias?: string
    ): string {
        const name = alias || apiItem.Name;
        // Abstract
        const abstract = apiItem.IsAbstract ? "abstract " : "";

        // TypeParameters
        const typeParametersString: string = TypeParametersToString(typeParameters);

        // Extends
        let extendsString: string;
        if (apiItem.Extends != null) {
            extendsString = ` extends ${apiItem.Extends.Text}`;
        } else {
            extendsString = "";
        }

        // Implements
        let implementsString: string;
        if (apiItem.Implements != null && apiItem.Implements.length > 0) {
            implementsString = ` implements ${apiItem.Implements.map(x => x.Text).join(", ")}`;
        } else {
            implementsString = "";
        }

        return `${abstract}class ${name}${typeParametersString}${extendsString}${implementsString}`;
    }

    export function TypeParametersToString(typeParameters?: Contracts.ApiTypeParameterDto[]): string {
        if (typeParameters != null && typeParameters.length > 0) {
            const params: string[] = typeParameters.map(TypeParameterToString);
            return `<${params.join(", ")}>`;
        } else {
            return "";
        }
    }

    export function TypeParameterToString(apiItem: Contracts.ApiTypeParameterDto): string {
        const extendsString = apiItem.ConstraintType != null ? ` extends ${apiItem.ConstraintType.Text}` : "";
        const defaultType = apiItem.DefaultType != null ? ` = ${apiItem.DefaultType.Text}` : "";

        return `${apiItem.Name}${extendsString}${defaultType}`;
    }

    // #endregion Stringifiers

    // #region Tables
    // export function ApiPropertiesToTableString(properties: Contracts.ApiPropertyDto[]): ReferenceDto<string[]> {
    //     const headers = ["Name", "Type", "Optional"];
    //     return ApiItemsToTableString<Contracts.ApiPropertyDto>(headers, properties, ApiPropertyToTableRow);
    // }

    // export function ApiPropertyToTableRow(property: Contracts.ApiPropertyDto): ReferenceDto<string[]> {
    //     const parameterTypeDto = TypeDtoToMarkdownString(property.Type);
    //     const isOptionalString = property.IsOptional ? "Yes" : "";

    //     return {
    //         Text: [property.Name, parameterTypeDto.Text, isOptionalString],
    //         References: parameterTypeDto.References
    //     };
    // }

    // export function ApiParametersToTableString(parameters: Contracts.ApiParameterDto[]): ReferenceDto<string[]> {
    //     const headers = ["Name", "Type", "Optional", "Initial value", "Description"];
    //     return ApiItemsToTableString<Contracts.ApiParameterDto>(headers, parameters, ApiParameterToTableRow);
    // }

    // // TODO: implement description.
    // // TODO: implement IsSpread.
    // export function ApiParameterToTableRow(parameter: Contracts.ApiParameterDto): ReferenceDto<string[]> {
    //     const parameterTypeDto = TypeDtoToMarkdownString(parameter.Type);
    //     const isOptionalString = parameter.IsOptional ? "Yes" : "";
    //     const initializerString = parameter.Initializer || "";

    //     return {
    //         Text: [parameter.Name, MarkdownGenerator.EscapeString(parameterTypeDto.Text), isOptionalString, initializerString],
    //         References: parameterTypeDto.References
    //     };
    // }

    // export function ApiTypeParametersTableToString(typeParameters: Contracts.ApiTypeParameterDto[]): ReferenceDto<string[]> {
    //     const headers = ["Name", "Constraint type", "Default type"];
    //     return ApiItemsToTableString<Contracts.ApiTypeParameterDto>(headers, typeParameters, ApiTypeParameterToTableRow);
    // }

    // // TODO: add description from @template jsdoc tag.
    // export function ApiTypeParameterToTableRow(typeParameter: Contracts.ApiTypeParameterDto): ReferenceDto<string[]> {
    //     let referenceIds: string[] = [];
    //     let constraintType: string = "";
    //     let defaultType: string = "";

    //     if (typeParameter.ConstraintType) {
    //         const parsedConstraintType = TypeDtoToMarkdownString(typeParameter.ConstraintType);

    //         referenceIds = referenceIds.concat(parsedConstraintType.References);
    //         constraintType = MarkdownGenerator.EscapeString(parsedConstraintType.Text);
    //     }

    //     if (typeParameter.DefaultType) {
    //         const parsedDefaultType = TypeDtoToMarkdownString(typeParameter.DefaultType);

    //         referenceIds = referenceIds.concat(parsedDefaultType.References);
    //         defaultType = MarkdownGenerator.EscapeString(parsedDefaultType.Text);
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

    //#endregion Tables

    // #region Call strings
    /**
     * Builds call declaration.
     *
     * Return example: `<TValue>(arg: TValue): void`.
     */
    export function ApiCallToString(
        typeParameters?: Contracts.ApiTypeParameterDto[],
        parameters?: Contracts.ApiParameterDto[],
        returnType?: Contracts.ApiType,
        typeDefChar: string = ":"
    ): string {
        // TypeParameters
        const typeParametersString = TypeParametersToString(typeParameters);

        // Parameters
        let parametersString: string;
        if (parameters != null && parameters.length > 0) {
            parametersString = parameters
                .map(ApiParameterToString)
                .join(", ");
        } else {
            parametersString = "";
        }

        // ReturnType
        const returnTypeString = returnType != null ? `${typeDefChar} ${returnType.Text}` : "";

        return `${typeParametersString}(${parametersString})${returnTypeString}`;
    }

    /**
     * Builds ApiParameter string.
     *
     * Return example: `arg: TValue`.
     */
    export function ApiParameterToString(apiItem: Contracts.ApiParameterDto): string {
        // FIXME: `?` and `| undefined` in a single statement.
        const initializerString = apiItem.Initializer ? ` = ${apiItem.Initializer}` : "";
        const isOptionalString = apiItem.IsOptional ? "?" : "";

        return `${apiItem.Name}${isOptionalString}: ${apiItem.Type.Text}${initializerString}`;
    }

    export function ApiClassConstructorToString(
        apiItem: Contracts.ApiClassConstructorDto,
        parameters?: Contracts.ApiParameterDto[],
        returnType?: Contracts.ApiType
    ): string {
        const callString = ApiCallToString(undefined, parameters, returnType);
        return `${apiItem.AccessModifier} constructor${callString}`;
    }

    /**
     * Builds function head from ApiFunction.
     *
     * Return example: `function foo<TValue>(arg: TValue): void`.
     */
    export function ApiFunctionToString(
        apiItem: Contracts.ApiFunctionDto,
        typeParameters?: Contracts.ApiTypeParameterDto[],
        parameters?: Contracts.ApiParameterDto[],
        alias?: string
    ): string {
        const name = alias || apiItem.Name;
        const callString = ApiCallToString(typeParameters, parameters, apiItem.ReturnType);

        return `function ${name}${callString}`;
    }

    /**
     * Builds construct declaration.
     *
     * Return example: `new <TValue>(arg: TValue): void`.
     */
    export function ApiConstructToString(
        typeParameters?: Contracts.ApiTypeParameterDto[],
        parameters?: Contracts.ApiParameterDto[],
        returnType?: Contracts.ApiType
    ): string {
        const callString = ApiCallToString(typeParameters, parameters, returnType);

        return `new ${callString}`;
    }

    /**
     * Builds method declaration.
     *
     * Return example: `someMethod<TValue>(arg: TValue): void`.
     */
    export function ApiMethodToString(
        name: string,
        typeParameters?: Contracts.ApiTypeParameterDto[],
        parameters?: Contracts.ApiParameterDto[],
        returnType?: Contracts.ApiType
    ): string {
        const callString = ApiCallToString(typeParameters, parameters, returnType);

        return `${name}${callString}`;
    }

    /**
     * Builds class method declaration.
     *
     * Return example: `public static SomeMethod<TValue>(arg: TValue): void`.
     */
    export function ApiClassMethodToString(
        apiItem: Contracts.ApiClassMethodDto,
        typeParameters: Contracts.ApiTypeParameterDto[],
        parameters: Contracts.ApiParameterDto[],
        alias?: string
    ): string {
        const name = alias || apiItem.Name;

        const optional = apiItem.IsOptional ? "?" : "";
        const abstract = apiItem.IsAbstract ? " abstract" : "";
        const async = apiItem.IsAsync ? " async" : "";
        const $static = apiItem.IsStatic ? " static" : "";
        const functionHeader = ApiMethodToString(`${name}${optional}`, typeParameters, parameters, apiItem.ReturnType);

        return `${apiItem.AccessModifier}${$static}${abstract}${async} ${functionHeader}`.trim();
    }

    /**
     * Build simplified method declaration
     *
     * Return example: `someMethod(parameter1, parameter2)`.
     */
    export function MethodToSimpleString(text: string, parameters: Contracts.ApiParameterDto[]): string {
        const parametersString = parameters
            .map(x => x.Name)
            .join(", ");

        return `${text}(${parametersString})`;
    }

    // #endregion Call strings
}
