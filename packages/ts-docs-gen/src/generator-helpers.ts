import { Contracts } from "ts-extractor";
import { MarkdownGenerator } from "@simplrjs/markdown";

export namespace GeneratorHelpers {
    export interface TypeToStringDto {
        References: string[];
        Text: string;
    }

    export function TypeDtoToMarkdownString(type: Contracts.TypeDto): TypeToStringDto {
        const references: string[] = [];
        let text: string = "";

        switch (type.ApiTypeKind) {
            case Contracts.TypeKinds.Union:
            case Contracts.TypeKinds.Intersection: {
                const symbol = type.ApiTypeKind === Contracts.TypeKinds.Union ? "|" : "&";

                type.Types
                    .map(TypeDtoToMarkdownString)
                    .forEach(typeItem => {
                        references.concat(typeItem.References);

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
                text = `${MarkdownGenerator.link(type.Name || "???", type.ReferenceId, true)}`;

                // Generics
                if (type.Generics != null) {
                    const generics = type.Generics.map(TypeDtoToMarkdownString);
                    references.concat(...generics.map(x => x.References));

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
                    references.concat(...generics.map(x => x.References));

                    text += `<${generics.map(x => x.Text).join(", ")}>`;
                }
            }
        }

        return {
            References: references,
            Text: text
        };
    }
}
