import { Contracts } from "ts-extractor";
import { MarkdownBuilder } from "@simplrjs/markdown";

import { SupportedApiItemKindType, PluginResult, PluginOptions } from "../contracts/plugin";
import { GeneratorHelpers } from "../generator-helpers";
import { FunctionLikePlugin } from "../abstractions/function-like-plugin";

export type CallableApiItem = Contracts.ApiCallDto | Contracts.ApiMethodDto | Contracts.ApiConstructDto;

export class ApiCallablePlugin extends FunctionLikePlugin<CallableApiItem> {
    public SupportedApiItemKinds(): SupportedApiItemKindType[] {
        return [
            GeneratorHelpers.ApiItemKinds.Construct,
            GeneratorHelpers.ApiItemKinds.Call,
            GeneratorHelpers.ApiItemKinds.Method
        ];
    }

    private resolveItemCode(
        apiItem: CallableApiItem,
        parameters: Contracts.ApiParameterDto[],
        typeParameters: Contracts.ApiTypeParameterDto[]
    ): string {
        switch (apiItem.ApiKind) {
            case Contracts.ApiItemKinds.Construct: {
                return GeneratorHelpers.ApiConstructToString(typeParameters, parameters, apiItem.ReturnType);
            }
            case Contracts.ApiItemKinds.Call: {
                return GeneratorHelpers.ApiCallToString(typeParameters, parameters, apiItem.ReturnType);
            }
            case Contracts.ApiItemKinds.Method: {
                return GeneratorHelpers.ApiMethodToString(apiItem.Name, typeParameters, parameters, apiItem.ReturnType);
            }
        }
    }

    public Render(options: PluginOptions<CallableApiItem>): PluginResult<CallableApiItem> {
        const pluginResult: PluginResult<CallableApiItem> = {
            ...GeneratorHelpers.GetDefaultPluginResultData(),
            ApiItem: options.ApiItem,
            Reference: options.Reference
        };

        // ApiParameters
        const apiParameters =
            GeneratorHelpers.GetApiItemsFromReference<Contracts.ApiParameterDto>(options.ExtractedData, options.ApiItem.Parameters);
        // ApiTypeParameters
        const apiTypeParameters =
            GeneratorHelpers.GetApiItemsFromReference<Contracts.ApiTypeParameterDto>(options.ExtractedData, options.ApiItem.TypeParameters);

        pluginResult.Result = new MarkdownBuilder()
            .Code(this.resolveItemCode(options.ApiItem, apiParameters, apiTypeParameters), GeneratorHelpers.DEFAULT_CODE_OPTIONS)
            .GetOutput();

        // TypeParameters
        const typeParametersResult = this.RenderTypeParameters(options.ExtractedData, apiTypeParameters);
        GeneratorHelpers.MergePluginResultData(pluginResult, typeParametersResult);

        // Parameters
        const parametersResult = this.RenderParameters(options.ExtractedData, apiParameters);
        GeneratorHelpers.MergePluginResultData(pluginResult, parametersResult);

        // ReturnType
        const returnTypeResult = this.RenderReturnType(options.ExtractedData, options.ApiItem.ReturnType);
        GeneratorHelpers.MergePluginResultData(pluginResult, returnTypeResult);

        return pluginResult;
    }
}
