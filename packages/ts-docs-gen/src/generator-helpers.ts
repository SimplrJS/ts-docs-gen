import { Contracts, ExtractDto } from "ts-extractor";
import { LogLevel } from "simplr-logger";
import { Contracts as MarkdownContracts } from "@simplrjs/markdown";
import * as path from "path";

import { ApiItemReference } from "./contracts/api-item-reference";
import { ApiDefinitionKindAdditional, PluginResultData } from "./contracts/plugin";
import { Logger } from "./utils/logger";
import { SerializedApiDefinitionConstructor, SerializedApiTypeConstructor } from "./contracts/serialized-api-item";
import { ApiDefinitionList, ApiDefinitions } from "./api-items/api-definition-list";
import { ApiTypeList, ApiTypes } from "./api-items/api-type-list";
import { ApiDefinitionDefault } from "./api-items/api-definition-default";
import { ApiTypeDefault } from "./api-items/api-type-default";
import { ApiItemReferenceRegistry } from "./registries/api-item-reference-registry";

export namespace GeneratorHelpers {
    //#region Serialize ApiItem
    const serializedReferenceRegistry = new ApiItemReferenceRegistry<ApiDefinitions>();

    export function SerializeApiDefinition<TKind extends Contracts.ApiBaseDefinition>(
        extractedData: ExtractDto,
        apiItem: TKind,
        reference: ApiItemReference
    ): ApiDefinitions {
        if (serializedReferenceRegistry.Exists(reference)) {
            return serializedReferenceRegistry.GetItem(reference)!;
        }

        for (const [kind, constructorItem] of ApiDefinitionList) {
            if (kind === apiItem.ApiKind) {
                const $constructor: SerializedApiDefinitionConstructor<TKind> = constructorItem;
                const serializedApiItem = new $constructor(extractedData, apiItem, reference);

                serializedReferenceRegistry.AddItem(reference, serializedApiItem);

                return serializedApiItem;
            }
        }

        LogWithApiItemPosition(LogLevel.Warning, apiItem, `"${apiItem.ApiKind}" is not supported!`);
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
        // TODO: Upgrade ts-extractor, so we could add informative warning.
        Logger.Warn(`"${apiType.ApiTypeKind}" is not supported`);
        return new ApiTypeDefault(extractedData, apiType);
    }

    //#endregion Serialize ApiItem

    // #region Defaults and constants
    export enum JSDocTags {
        Beta = "beta",
        Deprecated = "deprecated",
        Internal = "internal",
        Summary = "summary"
    }

    export const MARKDOWN_EXT = ".md";

    export const ApiDefinitionKind: typeof ApiDefinitionKindAdditional & typeof Contracts.ApiDefinitionKind =
        Object.assign(ApiDefinitionKindAdditional, Contracts.ApiDefinitionKind);

    export const DEFAULT_CODE_OPTIONS = {
        lang: "typescript"
    };

    export const DEFAULT_TABLE_OPTIONS: MarkdownContracts.TableOptions = {
        removeColumnIfEmpty: true,
        removeRowIfEmpty: true
    };

    // #endregion Defaults and constants

    // #region General helpers

    export function GetApiDefinitionKind(): typeof Contracts.ApiDefinitionKind & typeof ApiDefinitionKindAdditional {
        return Object.assign(Contracts.ApiDefinitionKind, ApiDefinitionKindAdditional);
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
                    case Contracts.ApiDefinitionKind.Export: {
                        if (apiItem.SourceFileId != null) {
                            const sourceFileReference = { Alias: apiItem.Name, Ids: [apiItem.SourceFileId] };
                            const referencesList = GetApiItemReferences(extractedData, [sourceFileReference]);
                            overallReferences = overallReferences.concat(referencesList);
                        }
                        break;
                    }
                    case Contracts.ApiDefinitionKind.ImportSpecifier:
                    case Contracts.ApiDefinitionKind.ExportSpecifier: {
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
                    case Contracts.ApiDefinitionKind.SourceFile: {
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

    export function LogWithApiItemPosition(logLevel: LogLevel, apiItem: Contracts.ApiBaseDefinition, message: string): void {
        const { FileName, Line, Character } = apiItem.Location;
        const linePrefix = `${FileName}(${Line},${Character + 1})`;
        Logger.Log(logLevel, `${linePrefix}: ${message}`);
    }

    export function StandardisePath(pathString: string): string {
        return pathString.split(path.sep).join("/");
    }

    export function IsApiItemKind<TKindDto extends Contracts.ApiDefinition>(
        itemKind: Contracts.ApiDefinitionKind,
        apiItem: Contracts.ApiDefinition): apiItem is TKindDto {
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

    export function GetDefaultPluginResultData<TKind = Contracts.ApiDefinition>(): PluginResultData<TKind> {
        return {
            Headings: [],
            Result: [],
            UsedReferences: [],
            Members: []
        };
    }
    // #endregion General helpers

    // #region Render helpers

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
}
