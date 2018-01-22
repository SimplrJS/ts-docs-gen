import { Contracts, ExtractDto } from "ts-extractor";
import { MarkdownBuilder } from "@simplrjs/markdown";

import { SupportedApiItemKindType, PluginResult, PluginOptions } from "../contracts/plugin";
import { GeneratorHelpers } from "../generator-helpers";
import { FunctionLikePlugin } from "../abstractions/function-like-plugin";
import { ApiConstruct } from "../api-items/definitions/api-construct";
import { ApiItemReference } from "../contracts/api-item-reference";
import { ApiCall } from "../api-items/definitions/api-call";
import { ApiMethod } from "../api-items/definitions/api-method";
import { ApiCallable } from "../api-items/api-callable";

export type CallableApiItem = Contracts.ApiCallDto | Contracts.ApiMethodDto | Contracts.ApiConstructDto;

export class ApiCallablePlugin extends FunctionLikePlugin<CallableApiItem> {
    public SupportedApiItemKinds(): SupportedApiItemKindType[] {
        return [
            GeneratorHelpers.ApiItemKinds.Construct,
            GeneratorHelpers.ApiItemKinds.Call,
            GeneratorHelpers.ApiItemKinds.Method
        ];
    }

    private resolveSerializedApiItem(
        extractedData: ExtractDto,
        apiItem: CallableApiItem,
        reference: ApiItemReference
    ): ApiCallable<CallableApiItem> {
        switch (apiItem.ApiKind) {
            case Contracts.ApiItemKinds.Construct: {
                return new ApiConstruct(extractedData, apiItem, reference);
            }
            case Contracts.ApiItemKinds.Call: {
                return new ApiCall(extractedData, apiItem, reference);
            }
            case Contracts.ApiItemKinds.Method: {
                return new ApiMethod(extractedData, apiItem, reference);
            }
        }
    }

    public Render(options: PluginOptions, apiItem: CallableApiItem): PluginResult<CallableApiItem> {
        const serializedApiItem = this.resolveSerializedApiItem(options.ExtractedData, apiItem, options.Reference);

        const pluginResult: PluginResult<CallableApiItem> = {
            ...GeneratorHelpers.GetDefaultPluginResultData(),
            ApiItem: apiItem,
            Reference: options.Reference
        };

        pluginResult.Result = new MarkdownBuilder()
            .Code(serializedApiItem.ToInlineText(), GeneratorHelpers.DEFAULT_CODE_OPTIONS)
            .GetOutput();

        // TypeParameters
        const typeParametersResult = this.RenderTypeParameters(options.ExtractedData, serializedApiItem.TypeParameters);
        GeneratorHelpers.MergePluginResultData(pluginResult, typeParametersResult);

        // Parameters
        const parametersResult = this.RenderParameters(options.ExtractedData, serializedApiItem.Parameters);
        GeneratorHelpers.MergePluginResultData(pluginResult, parametersResult);

        // ReturnType
        const returnTypeResult = this.RenderReturnType(options.ExtractedData, serializedApiItem.ReturnType);
        GeneratorHelpers.MergePluginResultData(pluginResult, returnTypeResult);

        return pluginResult;
    }
}
