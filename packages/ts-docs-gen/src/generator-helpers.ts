import { Contracts, ExtractDto, TSHelpers } from "ts-extractor";
import { LogLevel } from "simplr-logger";
import { MarkdownGenerator, MarkdownBuilder, Contracts as MarkdownContracts } from "@simplrjs/markdown";
import * as path from "path";

import { ApiItemReference } from "./contracts/api-item-reference";
import { ApiItemKindsAdditional, PluginResultData } from "./contracts/plugin";
import { Logger } from "./utils/logger";

export namespace GeneratorHelpers {
    export type TypeToStringDto = ReferenceDto<string>;

    export interface ReferenceDto<T = string | string[]> {
        References: string[];
        Text: T;
    }

    export const MARKDOWN_EXT = ".md";

    export const ApiItemKinds: typeof ApiItemKindsAdditional & typeof Contracts.ApiItemKinds =
        Object.assign(ApiItemKindsAdditional, Contracts.ApiItemKinds);

    export function GetApiItemKinds(): typeof Contracts.ApiItemKinds & typeof ApiItemKindsAdditional {
        return Object.assign(Contracts.ApiItemKinds, ApiItemKindsAdditional);
    }

    // TODO: implement type literal and function type.
    export function TypeDtoToMarkdownString(type: Contracts.TypeDto): TypeToStringDto {
        let references: string[] = [];
        let text: string = "";

        switch (type.ApiTypeKind) {
            case Contracts.TypeKinds.Union:
            case Contracts.TypeKinds.Intersection: {
                const symbol = type.ApiTypeKind === Contracts.TypeKinds.Union ? "|" : "&";

                if (type.ReferenceId != null) {
                    text = MarkdownGenerator.Link(type.Name || type.Text, type.ReferenceId, true);
                    references.push(type.ReferenceId);
                    break;
                }

                type.Types
                    .map(TypeDtoToMarkdownString)
                    .forEach(typeItem => {
                        references = references.concat(typeItem.References);

                        if (text === "") {
                            text = typeItem.Text;
                        } else {
                            text += ` ${symbol} ${typeItem.Text}`;
                        }
                    });
                break;
            }
            case Contracts.TypeKinds.Basic:
            default: {
                // Generics
                if (type.Name != null && type.Generics != null) {
                    const generics = type.Generics.map(TypeDtoToMarkdownString);
                    references = references.concat(...generics.map(x => x.References));

                    text += `<${generics.map(x => x.Text).join(", ")}>`;
                }

                // Basic type with reference.
                if (type.Name == null || TSHelpers.IsInternalSymbolName(type.Name)) {
                    text = type.Text;
                } else {
                    // FIXME: do not use flag string. Exclude Type parameters references.
                    if (type.ReferenceId != null && type.FlagsString !== "TypeParameter") {
                        text = MarkdownGenerator.Link(type.Name || type.Text, type.ReferenceId, true);
                        references.push(type.ReferenceId);
                    } else {
                        text = type.Name;
                    }
                }
            }
        }

        return {
            References: references,
            Text: text
        };
    }

    export enum JSDocTags {
        Beta = "beta",
        Deprecated = "deprecated",
        Summary = "summary"
    }

    export function RenderApiItemMetadata(apiItem: Contracts.ApiItemDto): string[] {
        const builder = new MarkdownBuilder();

        // Optimise?
        const isBeta = apiItem.Metadata.JSDocTags.findIndex(x => x.name.toLowerCase() === JSDocTags.Beta) !== -1;
        const deprecated = apiItem.Metadata.JSDocTags.find(x => x.name.toLowerCase() === JSDocTags.Deprecated);
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

    export function ApiVariableToString(item: Contracts.ApiVariableDto, alias?: string): string {
        const name = alias != null ? alias : item.Name;

        return `${item.VariableDeclarationType} ${name}: ${item.Type.Text};`;
    }

    export function ReconstructEnumCode(alias: string, memberItems: Contracts.ApiEnumMemberDto[]): string[] {
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
            `enum ${alias} {`,
            ...membersStrings,
            "}"
        ];
    }

    // TODO: reconsider location
    const TAB_STRING = "    ";

    export function Tab(size: number = 1): string {
        let result: string = "";
        for (let i = 0; i < size; i++) {
            result += TAB_STRING;
        }
        return result;
    }
    // ---------------------------------------------------

    export const DEFAULT_CODE_OPTIONS = {
        lang: "typescript"
    };

    export const DEFAULT_TABLE_OPTIONS: MarkdownContracts.TableOptions = {
        removeColumnIfEmpty: true
    };

    export function FixSentence(sentence: string, punctuationMark: string = "."): string {
        const trimmedSentence = sentence.trim();
        const punctuationMarks = ".!:;,-";

        const lastSymbol = trimmedSentence[trimmedSentence.length - 1];

        if (punctuationMarks.indexOf(lastSymbol) !== -1) {
            return trimmedSentence;
        }

        return trimmedSentence + punctuationMark;
    }

    export function ApiTypeToString(item: Contracts.ApiTypeDto, alias?: string): string {
        const name = alias != null ? alias : item.Name;

        return `type ${name} = ${item.Type.Text};`;
    }

    /**
     * From ApiFunction to build function head.
     *
     * Return example: `function foo<TValue>(arg: TValue): void`
     */
    export function ApiFunctionToString(
        apiItem: Contracts.ApiFunctionDto,
        typeParameters?: Contracts.ApiTypeParameterDto[],
        parameters?: Contracts.ApiParameterDto[],
        alias?: string
    ): string {
        const name = alias || apiItem.Name;

        // TypeParameters
        let typeParametersString: string;
        if (typeParameters != null && typeParameters.length > 0) {
            const params: string[] = typeParameters.map(TypeParameterToString);
            typeParametersString = `<${params.join(", ")}>`;
        } else {
            typeParametersString = "";
        }

        // Parameters
        let parametersString: string;
        if (parameters != null && parameters.length > 0) {
            parametersString = parameters
                .map(x => `${x.Name}: ${x.Type.Text}`)
                .join(", ");
        } else {
            parametersString = "";
        }

        // ReturnType
        const returnType = apiItem.ReturnType != null ? `: ${apiItem.ReturnType.Text}` : "";

        return `function ${name}${typeParametersString}(${parametersString})${returnType}`;
    }

    export function TypeParameterToString(apiItem: Contracts.ApiTypeParameterDto): string {
        const $extends = apiItem.ConstraintType != null ? ` extends ${apiItem.ConstraintType.Text}` : "";
        const defaultType = apiItem.DefaultType != null ? ` = ${apiItem.DefaultType.Text}` : "";

        return `${apiItem.Name}${$extends}${defaultType}`;
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
        let typeParametersString: string;
        if (typeParameters != null && typeParameters.length > 0) {
            const params: string[] = typeParameters.map(TypeParameterToString);
            typeParametersString = `<${params.join(", ")}>`;
        } else {
            typeParametersString = "";
        }

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

    export function ApiFunctionToSimpleString(
        alias: string,
        apiItem: Contracts.ApiFunctionDto,
        parametersApiItems: Contracts.ApiParameterDto[]
    ): string {
        const name = alias || apiItem.Name;
        const parametersString = parametersApiItems
            .map(x => x.Name)
            .join(", ");

        return `${name}(${parametersString})`;
    }

    export function GetApiItemsFromReference<T extends Contracts.ApiItemDto>(
        items: Contracts.ApiItemReference[],
        extractedData: ExtractDto
    ): T[] {
        const apiItems: T[] = [];

        for (const itemReferences of items) {
            for (const referenceId of itemReferences.Ids) {
                const apiItem = extractedData.Registry[referenceId] as T;
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

    export function MergePluginResultData<T extends PluginResultData>(a: T, b: PluginResultData): T {
        a.Headings = a.Headings.concat(b.Headings);
        a.Members = (a.Members || []).concat(b.Members || []);
        a.Result = a.Result.concat(b.Result);
        a.UsedReferences = a.UsedReferences.concat(b.UsedReferences);

        return a;
    }

    export function GetDefaultPluginResultData(): PluginResultData {
        return {
            Headings: [],
            Result: [],
            UsedReferences: []
        };
    }
}
