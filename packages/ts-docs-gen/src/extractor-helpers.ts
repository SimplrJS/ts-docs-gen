import { Contracts, ExtractDto } from "ts-extractor";
import { ReferenceTuple } from "./contracts/reference-tuple";

export namespace ExtractorHelpers {
    export function GetReferenceTuples(
        extractedData: ExtractDto,
        entryFile: Contracts.ApiSourceFileDto,
        itemsReference: Contracts.ApiItemReferenceTuple
    ): ReferenceTuple[] {
        let list: ReferenceTuple[] = [];

        for (const [alias, references] of itemsReference) {
            for (const referenceId of references) {
                // Check if item is ExportSpecifier or ExportDeclaration.
                const apiItem = extractedData.Registry[referenceId];

                switch (apiItem.ApiKind) {
                    case Contracts.ApiItemKinds.Export: {
                        const referenceTuples = GetReferenceTuples(extractedData, entryFile, apiItem.Members);
                        list = list.concat(referenceTuples);
                        break;
                    }
                    case Contracts.ApiItemKinds.ExportSpecifier: {
                        if (apiItem.ApiItems == null) {
                            console.warn(`ApiItems are missing in "${apiItem.Name}"?`);
                            break;
                        }
                        const referenceTuples = GetReferenceTuples(extractedData, entryFile, [[apiItem.Name, apiItem.ApiItems]]);
                        list = list.concat(referenceTuples);
                        break;
                    }
                    default: {
                        list.push([referenceId, alias]);
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
        const membersStrings = memberItems.map((memberItem, index, array) => {
            let memberString = `${ExtractorHelpers.Tab()} ${memberItem.Name}`;

            if (memberItem.Value) {
                memberString += ` = ${memberItem.Value}`;
            }

            // Checking if current item is not the last item
            if (index !== memberItems.length - 1) {
                memberString += ",";
            }

            return memberString;
        });

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

    export function FixSentence(sentence: string, punctuationMark: string = "."): string {
        const trimmedSentence = sentence.trim();
        const punctuationMarks = ".!:;,-";

        const lastSymbol = trimmedSentence[trimmedSentence.length - 1];

        if (punctuationMarks.indexOf(lastSymbol) !== -1) {
            return trimmedSentence;
        }

        return trimmedSentence + punctuationMark;
    }
}
