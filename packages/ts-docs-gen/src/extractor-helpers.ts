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
}
