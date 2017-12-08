import { Contracts } from "ts-extractor";
import { MarkdownGenerator, MarkdownBuilder } from "@simplrjs/markdown";

export namespace GeneratorHelpers {
    export interface TypeToStringDto {
        References: string[];
        Text: string;
    }

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
                if (type.ReferenceId != null) {
                    text = MarkdownGenerator.Link(type.Name || type.Text, type.ReferenceId, true);
                    references.push(type.ReferenceId);
                } else {
                    text = type.Name || type.Text;
                }
            }
        }

        return {
            References: references,
            Text: text
        };
    }

    export function TypeDtoToString(type: Contracts.TypeDto): string {
        let text: string = "";

        switch (type.ApiTypeKind) {
            case Contracts.TypeKinds.Union:
            case Contracts.TypeKinds.Intersection: {
                const symbol = type.ApiTypeKind === Contracts.TypeKinds.Union ? "|" : "&";

                if (type.ReferenceId != null) {
                    text = MarkdownGenerator.Link(type.Name || type.Text, type.ReferenceId, true);
                    break;
                }

                type.Types
                    .map(TypeDtoToMarkdownString)
                    .forEach(typeItem => {
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
                    text += `<${generics.map(x => x.Text).join(", ")}>`;
                }

                // Basic type with reference.
                if (type.ReferenceId != null) {
                    text = MarkdownGenerator.Link(type.Name || type.Text, type.ReferenceId, true);
                } else {
                    text = type.Name || type.Text;
                }
            }
        }

        return text;
    }

    export function TypeParameterToString(typeParameter: Contracts.ApiTypeParameterDto): string {
        let output = typeParameter.Name;

        if (typeParameter.ConstraintType != null) {
            output += ` extends ${TypeDtoToString(typeParameter.ConstraintType)}`;
        }

        if (typeParameter.DefaultType != null) {
            output += ` = ${TypeDtoToString(typeParameter.DefaultType)}`;
        }

        return output;
    }

    // TODO: implement.
    export function TypeParameterToMarkdownString(typeParameter: Contracts.ApiTypeParameterDto): string {
        let output = typeParameter.Name;

        if (typeParameter.ConstraintType != null) {
            output += ` extends ${TypeDtoToString(typeParameter.ConstraintType)}`;
        }

        if (typeParameter.DefaultType != null) {
            output += ` = ${TypeDtoToString(typeParameter.DefaultType)}`;
        }

        return output;
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
}
