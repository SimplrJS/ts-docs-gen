import { Contracts } from "ts-extractor";
// import { MarkdownGenerator } from "@simplrjs/markdown";

export namespace GeneratorHelpers {
    export interface TypeToStringDto {
        References: string[];
        Text: string;
    }

    // TODO: Resolve reference.
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
}
