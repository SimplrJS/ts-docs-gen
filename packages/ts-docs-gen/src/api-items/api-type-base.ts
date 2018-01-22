import { Contracts } from "ts-extractor";
import { SerializedApiType, ReferenceRenderHandler } from "../contracts/serialized-api-item";
import { BaseApiItemClass } from "../abstractions/base-api-item";
import { GeneratorHelpers } from "../generator-helpers";
import { ApiDefinitions } from "./api-definition-list";
import { Logger } from "../utils/logger";

export abstract class ApiTypeBase<TKind extends Contracts.ApiBaseType> extends BaseApiItemClass<TKind> implements SerializedApiType<TKind> {
    protected GetSerializedApiDefinition(referenceId: string): ApiDefinitions {
        const apiItem = this.ExtractedData.Registry[referenceId];
        return GeneratorHelpers.SerializeApiDefinition(this.ExtractedData, apiItem, { Alias: "", Id: referenceId });
    }

    protected SerializedTypeToString(render: ReferenceRenderHandler, apiType: SerializedApiType | undefined): string {
        if (apiType == null) {
            // TODO: Upgrade ts-extractor, so we could add informative warning.
            Logger.Warn("Missing type!");
            return "???";
        }

        return apiType.ToInlineText(render);
    }
}
