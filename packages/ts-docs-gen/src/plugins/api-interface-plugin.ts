import { Contracts, ExtractDto } from "ts-extractor";
import { MarkdownBuilder } from "@simplrjs/markdown";
import { Plugin, SupportedApiItemKindType, PluginResult, PluginOptions, PluginHeading } from "../contracts/plugin";
import { GeneratorHelpers } from "../generator-helpers";

export class ApiInterfacePlugin implements Plugin<Contracts.ApiInterfaceDto> {
    public SupportedApiItemKinds(): SupportedApiItemKindType[] {
        return [GeneratorHelpers.ApiItemKinds.Interface];
    }

    public CheckApiItem(item: Contracts.ApiInterfaceDto): boolean {
        return true;
    }

    private resolveTypeParameters(typeParameters: Contracts.ApiTypeParameterDto[]): GeneratorHelpers.ReferenceDto<string[]> {
        if (typeParameters.length === 0) {
            return { Text: [], References: [] };
        }

        const typeParametersTable = GeneratorHelpers.ApiTypeParametersTableToString(typeParameters);
        const text = new MarkdownBuilder()
            .Header("Type parameters", 3)
            .EmptyLine()
            .Text(typeParametersTable.Text)
            .EmptyLine()
            .GetOutput();

        return {
            Text: text,
            References: typeParametersTable.References
        };
    }

    private resolveConstraintTypes(apiItem: Contracts.ApiInterfaceDto): GeneratorHelpers.ReferenceDto<string[]> {
        if (apiItem.Extends.length === 0) {
            return {
                References: [],
                Text: []
            };
        }

        const builder = new MarkdownBuilder()
            .Header("Extends", 3)
            .EmptyLine();

        const references = [];

        for (const type of apiItem.Extends) {
            const typeDto = GeneratorHelpers.TypeDtoToMarkdownString(type);
            references.push(...typeDto.References);

            builder
                .Text(typeDto.Text)
                .EmptyLine();
        }

        return {
            References: references,
            Text: builder.GetOutput()
        };
    }

    private renderConstructMembers(
        apiItems: Contracts.ApiConstructDto[],
        extractedData: ExtractDto
    ): GeneratorHelpers.ReferenceDto<string[]> {
        if (apiItems.length === 0) {
            return {
                References: [],
                Text: []
            };
        }

        const references: string[] = [];
        const builder = new MarkdownBuilder()
            .Header("Construct", 3)
            .EmptyLine();

        for (const member of apiItems) {
            const resolvedMember = this.renderConstructMember(member, extractedData);
            references.push(...resolvedMember.References);
            builder
                .Text(resolvedMember.Text)
                .EmptyLine()
                .HorizontalRule()
                .EmptyLine();
        }

        return {
            References: references,
            Text: builder.GetOutput()
        };
    }

    private renderConstructMember(apiItem: Contracts.ApiConstructDto, extractedData: ExtractDto): GeneratorHelpers.ReferenceDto<string[]> {
        const references: string[] = [];
        const builder = new MarkdownBuilder();

        const parameters = GeneratorHelpers.GetApiItemsFromReference<Contracts.ApiParameterDto>(apiItem.Parameters, extractedData);

        // TODO: implement type parameter and return type.
        builder
            .Code(GeneratorHelpers.ApiConstructToString(undefined, parameters, undefined), GeneratorHelpers.DEFAULT_CODE_OPTIONS)
            .EmptyLine();

        if (parameters.length > 0) {
            const table = GeneratorHelpers.ApiParametersToTableString(parameters);
            references.push(...table.References);

            builder
                .Text("Parameters:")
                .EmptyLine()
                .Text(table.Text)
                .EmptyLine();
        }

        // TODO: implement return parameter.
        builder
            .Text("Return type:")
            .EmptyLine()
            .Text("Dummy return type.");

        return {
            References: references,
            Text: builder.GetOutput()
        };
    }

    private renderCallMembers(apiItems: Contracts.ApiCallDto[], extractedData: ExtractDto): GeneratorHelpers.ReferenceDto<string[]> {
        if (apiItems.length === 0) {
            return {
                References: [],
                Text: []
            };
        }

        const references: string[] = [];
        const builder = new MarkdownBuilder()
            .Header("Call", 3)
            .EmptyLine();

        for (const member of apiItems) {
            const resolvedMember = this.renderCallMember(member, extractedData);
            references.push(...resolvedMember.References);
            builder
                .Text(resolvedMember.Text)
                .EmptyLine()
                .HorizontalRule()
                .EmptyLine();
        }

        return {
            References: references,
            Text: builder.GetOutput()
        };
    }

    private renderCallMember(apiItem: Contracts.ApiCallDto, extractedData: ExtractDto): GeneratorHelpers.ReferenceDto<string[]> {
        const references: string[] = [];
        const builder = new MarkdownBuilder();

        const parameters = GeneratorHelpers.GetApiItemsFromReference<Contracts.ApiParameterDto>(apiItem.Parameters, extractedData);
        const typeParameters = GeneratorHelpers
            .GetApiItemsFromReference<Contracts.ApiTypeParameterDto>(apiItem.TypeParameters, extractedData);

        builder
            .Code(GeneratorHelpers.ApiCallToString(typeParameters, parameters, apiItem.ReturnType), GeneratorHelpers.DEFAULT_CODE_OPTIONS)
            .EmptyLine();

        if (parameters.length > 0) {
            const table = GeneratorHelpers.ApiParametersToTableString(parameters);
            references.push(...table.References);

            builder
                .Text("Parameters:")
                .EmptyLine()
                .Text(table.Text)
                .EmptyLine();
        }

        if (apiItem.ReturnType) {
            const renderedReturnType = GeneratorHelpers.TypeDtoToMarkdownString(apiItem.ReturnType);

            builder
                .Text("Return type:")
                .EmptyLine()
                .Text(renderedReturnType.Text);

            references.push(...renderedReturnType.References);
        }

        return {
            References: references,
            Text: builder.GetOutput()
        };
    }

    private renderIndexMembers(apiItems: Contracts.ApiIndexDto[], extractedData: ExtractDto): GeneratorHelpers.ReferenceDto<string[]> {
        if (apiItems.length === 0) {
            return {
                References: [],
                Text: []
            };
        }

        const references: string[] = [];
        const builder = new MarkdownBuilder()
            .Header("Index signatures", 3)
            .EmptyLine();

        for (const member of apiItems) {
            const resolvedMember = this.renderIndexMember(member, extractedData);
            references.push(...resolvedMember.References);
            builder
                .Text(resolvedMember.Text)
                .EmptyLine()
                .HorizontalRule()
                .EmptyLine();
        }

        return {
            References: references,
            Text: builder.GetOutput()
        };
    }

    private renderIndexMember(apiItem: Contracts.ApiIndexDto, extractedData: ExtractDto): GeneratorHelpers.ReferenceDto<string[]> {
        const parameter = extractedData.Registry[apiItem.Parameter] as Contracts.ApiParameterDto;

        const parameterType = GeneratorHelpers.TypeDtoToMarkdownString(parameter.Type);
        const indexType = GeneratorHelpers.TypeDtoToMarkdownString(apiItem.Type);

        const builder = new MarkdownBuilder()
            .Code(GeneratorHelpers.ApiIndexToString(parameter, apiItem.Type, apiItem.IsReadonly), GeneratorHelpers.DEFAULT_CODE_OPTIONS)
            .EmptyLine();

        if (apiItem.IsReadonly) {
            builder
                .Text("Readonly.")
                .EmptyLine();
        }

        builder
            .Text(`Index \`${parameter.Name}\` - ${parameterType.Text}`)
            .EmptyLine()
            .Text(`Type - ${indexType.Text}`);

        return {
            References: [
                ...parameterType.References,
                ...indexType.References
            ],
            Text: builder.GetOutput()
        };
    }

    private renderMethodMembers(apiItems: Contracts.ApiMethodDto[], extractedData: ExtractDto): GeneratorHelpers.ReferenceDto<string[]> {
        if (apiItems.length === 0) {
            return {
                References: [],
                Text: []
            };
        }

        const references: string[] = [];
        const builder = new MarkdownBuilder()
            .Header("Methods", 3)
            .EmptyLine();

        for (const member of apiItems) {
            const resolvedMember = this.renderMethodMember(member, extractedData);
            references.push(...resolvedMember.References);
            builder
                .Text(resolvedMember.Text)
                .EmptyLine()
                .HorizontalRule()
                .EmptyLine();
        }

        return {
            References: references,
            Text: builder.GetOutput()
        };
    }

    private renderMethodMember(apiItem: Contracts.ApiMethodDto, extractedData: ExtractDto): GeneratorHelpers.ReferenceDto<string[]> {
        const references: string[] = [];
        const builder = new MarkdownBuilder();

        const parameters = GeneratorHelpers.GetApiItemsFromReference<Contracts.ApiParameterDto>(apiItem.Parameters, extractedData);
        const typeParameters = GeneratorHelpers
            .GetApiItemsFromReference<Contracts.ApiTypeParameterDto>(apiItem.TypeParameters, extractedData);

        const methodDeclaration = GeneratorHelpers.ApiMethodToString(apiItem.Name, typeParameters, parameters, apiItem.ReturnType);

        builder
            .Code(methodDeclaration, GeneratorHelpers.DEFAULT_CODE_OPTIONS)
            .EmptyLine();

        if (parameters.length > 0) {
            const table = GeneratorHelpers.ApiParametersToTableString(parameters);
            references.push(...table.References);

            builder
                .Text("Parameters:")
                .EmptyLine()
                .Text(table.Text)
                .EmptyLine();
        }

        if (apiItem.ReturnType) {
            const renderedReturnType = GeneratorHelpers.TypeDtoToMarkdownString(apiItem.ReturnType);

            builder
                .Text("Return type:")
                .EmptyLine()
                .Text(renderedReturnType.Text);

            references.push(...renderedReturnType.References);
        }

        return {
            References: references,
            Text: builder.GetOutput()
        };
    }

    private renderPropertyMembers(apiItems: Contracts.ApiPropertyDto[]): GeneratorHelpers.ReferenceDto<string[]> {
        if (apiItems.length === 0) {
            return {
                References: [],
                Text: []
            };
        }

        const table = GeneratorHelpers.ApiPropertiesToTableString(apiItems);
        const builder = new MarkdownBuilder()
            .Header("Properties", 3)
            .EmptyLine()
            .Text(table.Text);

        return {
            References: table.References,
            Text: builder.GetOutput()
        };
    }

    public Render(data: PluginOptions<Contracts.ApiInterfaceDto>): PluginResult {
        const alias = data.Reference.Alias;
        const headings: PluginHeading[] = [
            {
                ApiItemId: data.Reference.Id,
                Heading: alias
            }
        ];

        const typeParameters = GeneratorHelpers.GetApiItemsFromReference<Contracts.ApiTypeParameterDto>(
            data.ApiItem.TypeParameters,
            data.ExtractedData
        );

        const resolvedTypeParameters = this.resolveTypeParameters(typeParameters);
        const resolvedConstraintTypes = this.resolveConstraintTypes(data.ApiItem);

        const memberItems = GeneratorHelpers.GetApiItemsFromReference(
            data.ApiItem.Members,
            data.ExtractedData
        );

        const constructMembers = memberItems
            .filter<Contracts.ApiConstructDto>(GeneratorHelpers.IsApiItemKind.bind(undefined, Contracts.ApiItemKinds.Construct));
        const renderedConstructMembers = this.renderConstructMembers(constructMembers, data.ExtractedData);

        const callMembers = memberItems
            .filter<Contracts.ApiCallDto>(GeneratorHelpers.IsApiItemKind.bind(undefined, Contracts.ApiItemKinds.Call));
        const renderedCallMembers = this.renderCallMembers(callMembers, data.ExtractedData);

        const indexMembers = memberItems
            .filter<Contracts.ApiIndexDto>(GeneratorHelpers.IsApiItemKind.bind(undefined, Contracts.ApiItemKinds.Index));
        const renderedIndexMembers = this.renderIndexMembers(indexMembers, data.ExtractedData, );

        const methodMembers = memberItems
            .filter<Contracts.ApiMethodDto>(GeneratorHelpers.IsApiItemKind.bind(undefined, Contracts.ApiItemKinds.Method));
        const renderedMethodMembers = this.renderMethodMembers(methodMembers, data.ExtractedData);

        const propertyMembers = memberItems
            .filter<Contracts.ApiPropertyDto>(GeneratorHelpers.IsApiItemKind.bind(undefined, Contracts.ApiItemKinds.Property));
        const renderedPropertyMembers = this.renderPropertyMembers(propertyMembers);

        const interfaceString = GeneratorHelpers.ApiInterfaceToString(
            data.ApiItem,
            typeParameters,
            constructMembers,
            callMembers,
            indexMembers,
            methodMembers,
            propertyMembers,
            data.ExtractedData
        );

        const builder = new MarkdownBuilder()
            .Header(GeneratorHelpers.ApiInterfaceToSimpleString(alias, data.ApiItem), 2)
            .EmptyLine()
            .Text(GeneratorHelpers.RenderApiItemMetadata(data.ApiItem))
            .Code(interfaceString, GeneratorHelpers.DEFAULT_CODE_OPTIONS)
            .EmptyLine()
            .Text(resolvedConstraintTypes.Text)
            .Text(resolvedTypeParameters.Text)
            .Text(renderedConstructMembers.Text)
            .Text(renderedCallMembers.Text)
            .Text(renderedIndexMembers.Text)
            .Text(renderedMethodMembers.Text)
            .Text(renderedPropertyMembers.Text);

        return {
            ApiItem: data.ApiItem,
            Reference: data.Reference,
            Headings: headings,
            UsedReferences: [
                ...resolvedTypeParameters.References,
                ...resolvedConstraintTypes.References,
                ...renderedConstructMembers.References,
                ...renderedConstructMembers.References,
                ...renderedIndexMembers.References,
                ...renderedMethodMembers.References,
                ...renderedPropertyMembers.References
            ],
            Result: builder.GetOutput()
        };
    }
}
