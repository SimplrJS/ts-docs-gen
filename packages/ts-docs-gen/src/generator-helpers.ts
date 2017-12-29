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
        removeColumnIfEmpty: true,
        removeRowIfEmpty: true
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

    /**
     * Builds call declaration.
     *
     * Return example: `<TValue>(arg: TValue): void`
     */
    export function ApiCallToString(
        typeParameters?: Contracts.ApiTypeParameterDto[],
        parameters?: Contracts.ApiParameterDto[],
        returnType?: Contracts.TypeDto
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
        const returnTypeString = returnType != null ? `: ${returnType.Text}` : "";

        return `${typeParametersString}(${parametersString})${returnTypeString}`;
    }

    export function ApiParameterToString(apiItem: Contracts.ApiParameterDto): string {
        const isOptionalString = apiItem.IsOptional ? "?" : "";
        return `${apiItem.Name}${isOptionalString}: ${apiItem.Type.Text}`;
    }

    /**
     * Builds function head from ApiFunction.
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
        const callString = ApiCallToString(typeParameters, parameters, apiItem.ReturnType);

        return `function ${name}${callString}`;
    }

    /**
     * Builds construct declaration.
     *
     * Return example: `new <TValue>(arg: TValue): void`
     */
    export function ApiConstructToString(
        typeParameters?: Contracts.ApiTypeParameterDto[],
        parameters?: Contracts.ApiParameterDto[],
        returnType?: Contracts.TypeDto
    ): string {
        const callString = ApiCallToString(typeParameters, parameters, returnType);

        return `new ${callString}`;
    }

    export function ApiMethodToString(
        name: string,
        typeParameters?: Contracts.ApiTypeParameterDto[],
        parameters?: Contracts.ApiParameterDto[],
        returnType?: Contracts.TypeDto
    ): string {
        const callString = ApiCallToString(typeParameters, parameters, returnType);

        return `${name}${callString}`;
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

    export function ApiClassMethodToString(
        apiItem: Contracts.ApiClassMethodDto,
        parameters: Contracts.ApiParameterDto[],
        alias?: string
    ): string {
        const name = alias || apiItem.Name;

        const optional = apiItem.IsOptional ? "?" : "";
        const abstract = apiItem.IsAbstract ? " abstract" : "";
        const async = apiItem.IsAsync ? " async" : "";
        const $static = apiItem.IsStatic ? " static" : "";
        const functionHeader = CallableParametersToString(`${name}${optional}`, parameters, apiItem.ReturnType);

        return `${apiItem.AccessModifier}${$static}${abstract}${async} ${functionHeader}`.trim();
    }

    export function ApiClassPropertyToString(apiItem: Contracts.ApiClassPropertyDto, alias?: string): string {
        const name = alias || apiItem.Name;

        const optional = apiItem.IsOptional ? "?" : "";
        const abstract = apiItem.IsAbstract ? " abstract" : "";
        const $static = apiItem.IsStatic ? " static" : "";

        return `${apiItem.AccessModifier}${$static}${abstract} ${name}${optional}: ${apiItem.Type.Text};`;
    }

    export function CallableParametersToSimpleString(text: string, parameters: Contracts.ApiParameterDto[]): string {
        const parametersString = parameters
            .map(x => x.Name)
            .join(", ");

        return `${text}(${parametersString})`;
    }

    export function CallableParametersToString(
        text: string,
        parameters: Contracts.ApiParameterDto[],
        returnType?: Contracts.TypeDto
    ): string {
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
        let returnTypeString: string;
        if (returnType != null) {
            returnTypeString = `: ${returnType.Text}`;
        } else {
            returnTypeString = "";
        }

        return `${text}(${parametersString})${returnTypeString}`;
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

    export function ApiInterfaceToSimpleString(alias: string, apiItem: Contracts.ApiInterfaceDto): string {
        const name = alias || apiItem.Name;
        return `interface ${name}`;
    }

    export function ApiInterfaceToString(
        apiItem: Contracts.ApiInterfaceDto,
        typeParameters: Contracts.ApiTypeParameterDto[],
        constructMembers: Contracts.ApiConstructDto[],
        callMembers: Contracts.ApiCallDto[],
        indexMembers: Contracts.ApiIndexDto[],
        methodMembers: Contracts.ApiMethodDto[],
        propertyMembers: Contracts.ApiPropertyDto[],
        extractedData: ExtractDto
    ): string[] {
        const typeParametersString = TypeParametersToString(typeParameters);

        const typesExtended = apiItem.Extends
            .map(TypeDtoToMarkdownString)
            .join(", ");

        const builder = new MarkdownBuilder()
            .Text(`interface ${apiItem.Name}${typeParametersString} extends ${typesExtended} {`);

        constructMembers.forEach(member => {
            const parameters = GetApiItemsFromReference<Contracts.ApiParameterDto>(member.Parameters, extractedData);
            const memberTypeParameters = GetApiItemsFromReference<Contracts.ApiTypeParameterDto>(member.TypeParameters, extractedData);
            builder.Text(`${Tab(1)}${ApiConstructToString(memberTypeParameters, parameters, member.ReturnType)};`);
        });

        callMembers.forEach(member => {
            const parameters = GetApiItemsFromReference<Contracts.ApiParameterDto>(member.Parameters, extractedData);
            const memberTypeParameters = GetApiItemsFromReference<Contracts.ApiTypeParameterDto>(member.TypeParameters, extractedData);
            builder.Text(`${Tab(1)}${ApiCallToString(memberTypeParameters, parameters, member.ReturnType)};`);
        });

        indexMembers.forEach(member => {
            const parameter = extractedData.Registry[member.Parameter] as Contracts.ApiParameterDto;
            builder.Text(`${Tab(1)}${ApiIndexToString(parameter, member.Type, member.IsReadonly)};`);
        });

        methodMembers.forEach(member => {
            const parameters = GetApiItemsFromReference<Contracts.ApiParameterDto>(member.Parameters, extractedData);
            const memberTypeParameters = GetApiItemsFromReference<Contracts.ApiTypeParameterDto>(apiItem.TypeParameters, extractedData);

            builder.Text(`${Tab(1)}${ApiMethodToString(apiItem.Name, memberTypeParameters, parameters)};`);
        });

        propertyMembers.forEach(member => {
            builder.Text(`${Tab(1)}${ApiPropertyToString(member)};`);
        });

        builder.Text("}");

        return builder.GetOutput();
    }

    export function ApiPropertyToString(apiItem: Contracts.ApiPropertyDto): string {
        const isReadOnlyString = apiItem.IsReadonly ? "readonly " : "";
        const isOptionalString = apiItem.IsReadonly ? "?" : "";
        const returnTypeString = TypeDtoToMarkdownString(apiItem.Type).Text;
        return `${isReadOnlyString}${apiItem.Name}${isOptionalString}: ${returnTypeString}`;
    }

    // TODO: add description from @template jsdoc tag.
    export function ApiTypeParametersTableToString(typeParameters: Contracts.ApiTypeParameterDto[]): ReferenceDto<string[]> {
        if (typeParameters.length === 0) {
            return {
                References: [],
                Text: []
            };
        }

        let referenceIds: string[] = [];
        const header = ["Name", "Constraint type", "Default type"];
        const content = typeParameters.map(typeParameter => {
            let constraintType: string = "";
            let defaultType: string = "";

            if (typeParameter.ConstraintType) {
                const parsedConstraintType = TypeDtoToMarkdownString(typeParameter.ConstraintType);

                referenceIds = referenceIds.concat(parsedConstraintType.References);
                constraintType = MarkdownGenerator.EscapeString(parsedConstraintType.Text);
            }

            if (typeParameter.DefaultType) {
                const parsedDefaultType = TypeDtoToMarkdownString(typeParameter.DefaultType);

                referenceIds = referenceIds.concat(parsedDefaultType.References);
                defaultType = MarkdownGenerator.EscapeString(parsedDefaultType.Text);
            }

            return [typeParameter.Name, constraintType, defaultType];
        });

        return {
            References: referenceIds,
            Text: MarkdownGenerator.Table(header, content, DEFAULT_TABLE_OPTIONS)
        };
    }

    export function IsApiItemKind<TKindDto extends Contracts.ApiItemDto>(
        itemKind: Contracts.ApiItemKinds,
        apiItem: Contracts.ApiItemDto): apiItem is TKindDto {
        return apiItem.ApiKind === itemKind;
    }

    // TODO: implement description.
    // TODO: implement IsSpread.
    export function ApiParametersToTableString(parameters: Contracts.ApiParameterDto[]): ReferenceDto<string[]> {
        if (parameters.length === 0) {
            return {
                References: [],
                Text: []
            };
        }

        let referenceIds: string[] = [];
        const header = ["Name", "Type", "Optional", "Description"];

        const content = parameters.map(parameter => {
            const parameterTypeDto = TypeDtoToMarkdownString(parameter.Type);

            referenceIds = referenceIds.concat(parameterTypeDto.References);

            const isOptionalString = parameter.IsOptional ? "Yes" : "";

            return [parameter.Name, MarkdownGenerator.EscapeString(parameterTypeDto.Text), isOptionalString];
        });

        return {
            Text: MarkdownGenerator.Table(header, content, DEFAULT_TABLE_OPTIONS),
            References: referenceIds
        };
    }

    export function ApiIndexToString(parameter: Contracts.ApiParameterDto, type: Contracts.TypeDto, readOnly: boolean = false): string {
        const typeString = TypeDtoToMarkdownString(type).Text;
        const parameterTypeString = TypeDtoToMarkdownString(parameter.Type).Text;

        const readOnlyString = readOnly ? "readonly " : "";

        return `${readOnlyString}[${parameter.Name}: ${parameterTypeString}]: ${typeString}`;
    }

    export function ApiPropertiesToTableString(properties: Contracts.ApiPropertyDto[]): ReferenceDto<string[]> {
        if (properties.length === 0) {
            return {
                References: [],
                Text: []
            };
        }

        let referenceIds: string[] = [];
        const header = ["Name", "Type", "Optional"];

        const content = properties.map(property => {
            const parameterTypeDto = TypeDtoToMarkdownString(property.Type);

            referenceIds = referenceIds.concat(parameterTypeDto.References);

            const isOptionalString = property.IsOptional ? "Yes" : "";

            return [property.Name, MarkdownGenerator.EscapeString(parameterTypeDto.Text), isOptionalString];
        });

        return {
            Text: MarkdownGenerator.Table(header, content, DEFAULT_TABLE_OPTIONS),
            References: referenceIds
        };
    }

    export function MergePluginResultData<T extends PluginResultData>(a: T, b: Partial<PluginResultData>): T {
        a.Headings = a.Headings.concat(b.Headings || []);
        a.Members = (a.Members || []).concat(b.Members || []);
        a.Result = a.Result.concat(b.Result || []);
        a.UsedReferences = a.UsedReferences.concat(b.UsedReferences || []);

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
