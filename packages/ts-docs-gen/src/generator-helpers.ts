import { Contracts } from "ts-extractor";
import { MarkdownGenerator } from "@simplrjs/markdown";

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
            case Contracts.TypeKinds.Reference: {
                references.push(type.ReferenceId);

                // Link to definition
                text = `${MarkdownGenerator.Link(type.Name || "???", type.ReferenceId, true)}`;

                // Generics
                if (type.Generics != null) {
                    const generics = type.Generics.map(TypeDtoToMarkdownString);
                    references = references.concat(...generics.map(x => x.References));

                    text += `<${generics.map(x => x.Text).join(", ")}>`;
                }
                break;
            }
            case Contracts.TypeKinds.Basic:
            default: {
                text = type.Name || type.Text;

                // Generics
                if (type.Name != null && type.Generics != null) {
                    const generics = type.Generics.map(TypeDtoToMarkdownString);
                    references = references.concat(...generics.map(x => x.References));

                    text += `<${generics.map(x => x.Text).join(", ")}>`;
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

                type.Types
                    .map(TypeDtoToString)
                    .forEach(typeString => {
                        if (text === "") {
                            text = typeString;
                        } else {
                            text += ` ${symbol} ${typeString}`;
                        }
                    });
                break;
            }
            case Contracts.TypeKinds.Reference: {
                text = type.Name || "???";

                // Generics
                if (type.Generics != null) {
                    const generics = type.Generics.map(TypeDtoToString);

                    text += `<${generics.join(", ")}>`;
                }
                break;
            }
            case Contracts.TypeKinds.Basic:
            default: {
                text = type.Name || type.Text;

                // Generics
                if (type.Name != null && type.Generics != null) {
                    const generics = type.Generics.map(TypeDtoToString);

                    text += `<${generics.join(", ")}>`;
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
}
