import * as ts from "typescript";
import { Contracts, ExtractDto } from "ts-extractor";
import { MarkdownGenerator, MarkdownBuilder, Contracts as MarkdownContracts } from "@simplrjs/markdown";
import { ApiItemReference } from "./contracts/api-item-reference";
import { ApiItemKindsAdditional } from "./contracts/plugin";

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

    // TODO: reexport InternalSymbolName in ts-extractor.
    export function IsTypeScriptInternalSymbolName(name: string): boolean {
        return Object.values(ts.InternalSymbolName).indexOf(name) !== -1;
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
                if (type.Name == null || IsTypeScriptInternalSymbolName(type.Name)) {
                    text = type.Text;
                } else {
                    // FIXME: do not use flag string. Exclude Type parameters references.
                    if (type.ReferenceId != null && type.FlagsString !== "TypeParameter" && type.FlagsString !== "TypeLiteral") {
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
        itemsReference: Contracts.ApiItemReferenceTuple
    ): ApiItemReference[] {
        let list: ApiItemReference[] = [];

        for (const [alias, references] of itemsReference) {
            for (const referenceId of references) {
                // Check if item is ExportSpecifier or ExportDeclaration.
                const apiItem = extractedData.Registry[referenceId];

                switch (apiItem.ApiKind) {
                    case Contracts.ApiItemKinds.Export: {
                        const referenceTuples = GetApiItemReferences(extractedData, apiItem.Members);
                        list = list.concat(referenceTuples);
                        break;
                    }
                    case Contracts.ApiItemKinds.ExportSpecifier: {
                        if (apiItem.ApiItems == null) {
                            console.warn(`ApiItems are missing in "${apiItem.Name}"?`);
                            break;
                        }
                        const referenceTuples = GetApiItemReferences(extractedData, [[apiItem.Name, apiItem.ApiItems]]);
                        list = list.concat(referenceTuples);
                        break;
                    }
                    default: {
                        list.push({
                            Id: referenceId,
                            Alias: alias
                        });
                    }
                }
            }
        }

        return list;
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

    export function ApiFunctionToString(
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

    export function GetApiItemsFromReferenceTuple<T extends Contracts.ApiItemDto>(
        items: Contracts.ApiItemReferenceTuple,
        extractedData: ExtractDto
    ): T[] {
        const apiItems: T[] = [];

        for (const itemReferences of items) {
            const [, references] = itemReferences;

            for (const reference of references) {
                const apiItem = extractedData.Registry[reference] as T;
                apiItems.push(apiItem);
            }
        }

        return apiItems;
    }
}
